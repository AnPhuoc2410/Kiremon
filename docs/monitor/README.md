# LGTM Observability Stack

> **L**oki · **G**rafana · **T**empo · **M**etrics (Prometheus)  
> Single Binary Mode — Homelab / Single VPS

---

## Mục lục

1. [Kiến trúc tổng quan](#1-kiến-trúc-tổng-quan)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Yêu cầu trước khi chạy](#3-yêu-cầu-trước-khi-chạy)
4. [Khởi động stack](#4-khởi-động-stack)
5. [Cấu hình từng service](#5-cấu-hình-từng-service)
   - [docker-compose.yml](#docker-composeyml)
   - [prometheus.yml](#prometheusyml)
   - [loki-config.yml](#loki-configyml)
   - [tempo.yaml](#tempoyaml)
   - [alloy-config.alloy](#alloy-configalloy)
   - [datasources.yaml](#datasourcesyaml)
6. [Data flow](#6-data-flow)
7. [Lưu ý quan trọng](#7-lưu-ý-quan-trọng)
8. [Tích hợp ứng dụng](#8-tích-hợp-ứng-dụng)
9. [Upgrade & bảo trì](#9-upgrade--bảo-trì)

---

## 1. Kiến trúc tổng quan

```
                        ┌─────────────────────────────────────────┐
                        │         network: global_lgtm            │
                        │                                          │
  Docker containers ────┤──► Alloy ──► Loki        (logs)        │
  (logs + metrics)      │       │                                  │
                        │       ├──► Prometheus    (metrics)      │
  Instrumented apps ────┤──►    │                                  │
  (OTLP gRPC/HTTP)      │       └──► Tempo         (traces)       │
                        │                                          │
                        │    Grafana ◄── Prometheus / Loki / Tempo│
                        └─────────────────────────────────────────┘
```

**Alloy** là trung tâm thu thập — nhận logs từ Docker socket, scrape metrics từ container, nhận traces qua OTLP rồi forward tất cả đến đúng backend.

---

## 2. Cấu trúc thư mục

```
LGTM_Stack/
├── docker-compose.yml
└── config/
    ├── alloy-config.alloy
    ├── datasources.yaml
    ├── loki-config.yml
    ├── prometheus.yml
    └── tempo.yaml
```

> **Lưu ý:** Không cần tạo thư mục `data/`. Docker named volumes tự được quản lý tại `/var/lib/docker/volumes/`.

---

## 3. Yêu cầu trước khi chạy

**Tạo external network** (chỉ cần làm 1 lần):

```bash
docker network create global_lgtm
```

Network này dùng chung cho nhiều Docker Compose project khác nhau. Các container ở project khác muốn gửi telemetry về stack này chỉ cần join vào `global_lgtm`.

**Kiểm tra Docker socket:**

```bash
ls -la /var/run/docker.sock
# Alloy cần đọc socket này để discover container
```

---

## 4. Khởi động stack

```bash
# Khởi động toàn bộ stack
docker compose up -d

# Kiểm tra trạng thái
docker compose ps

# Xem logs một service cụ thể
docker compose logs -f alloy
docker compose logs -f loki

# Dừng stack (giữ nguyên data)
docker compose down

# Dừng và xóa toàn bộ data
docker compose down -v
```

**Endpoints sau khi khởi động:**

| Service    | URL                       | Mục đích                     |
|------------|---------------------------|------------------------------|
| Grafana    | http://localhost:3000     | Dashboard chính              |
| Alloy UI   | (internal only)           | Không expose ra ngoài        |
| Prometheus | (internal only)           | Không expose ra ngoài        |
| Loki       | (internal only)           | Không expose ra ngoài        |
| Tempo      | (internal only)           | Không expose ra ngoài        |

---

## 5. Cấu hình từng service

### docker-compose.yml

**Các quyết định thiết kế:**

- **`latest` tag:** Dùng có chủ đích cho homelab. Nếu chuyển production, pin version cụ thể (ví dụ `grafana/loki:3.5.1`) để tránh breaking change khi auto-pull.
- **OTLP ports expose ra host:** `4317` (gRPC) và `4318` (HTTP) được expose để apps từ Docker project khác có thể gửi traces/metrics/logs về Alloy. Tempo không expose OTLP vì chỉ nhận từ Alloy nội bộ.
- **`--web.enable-lifecycle`:** Cho phép hot-reload Prometheus config bằng `POST http://prometheus:9090/-/reload` mà không cần restart container.
- **`--web.enable-remote-write-receiver`:** Cho phép Alloy push metrics vào Prometheus thay vì Prometheus đi scrape.
- **`--enable-feature=native-histograms`:** Bật native histogram cho Prometheus, đồng bộ với `generate_native_histograms: both` trong Tempo.
- **Grafana feature toggles:** `traceqlEditor`, `traceQLStreaming`, `metricsSummary` là các tính năng Tempo hiện đại cần bật thủ công.

**Port Alloy UI:**

```yaml
ports:
  - "12345:12345"   # Đang bind 0.0.0.0 — accessible từ internet nếu VPS có public IP
  # Production: đổi thành "127.0.0.1:12345:12345"
```

---

### prometheus.yml

**Thiết kế tối giản có chủ đích:**

Prometheus chỉ scrape 2 target:
- `prometheus:9090` — self-monitoring
- ~~`alloy:12345`~~ — **đã bỏ** (xem mục Lưu ý quan trọng #1)

Metrics của tất cả container khác được Alloy **push** vào Prometheus qua remote write (`/api/v1/write`), không phải Prometheus đi pull. Đây là pattern phù hợp với Alloy làm collector trung tâm.

```yaml
global:
  scrape_interval: 15s       # Match với timeInterval trong datasources.yaml
  evaluation_interval: 15s
```

---

### loki-config.yml

**Các quyết định quan trọng:**

- **`auth_enabled: false`:** Single-tenant mode. Bật lên nếu sau này multi-tenant.
- **Schema v13 + TSDB index:** Chuẩn hiện tại của Loki 3.x. Không thay đổi schema sau khi đã có data — nếu muốn upgrade, thêm entry mới với `from: <ngày tương lai>`.
- **`common.path_prefix: /loki`:** Đủ để Loki tự resolve các path nội bộ trong Docker network. Không cần `instance_addr: 127.0.0.1` vì DNS của Docker network tự xử lý.
- **WAL (`wal.enabled: true`):** Bảo vệ data khi container crash trước khi flush chunk ra storage.
- **`pattern_ingester.enabled: true`:** Tính năng Loki 3.x — tự động detect log patterns, hỗ trợ tab "Patterns" trong Grafana Explore.
- **`allow_structured_metadata: true`:** Tương thích với OpenTelemetry log format từ Alloy.
- **`discover_service_name`:** Loki tự detect tên service từ các label phổ biến, hiển thị đẹp hơn trong Explore.

**Retention:**

```yaml
limits_config:
  retention_period: 744h   # 31 ngày
compactor:
  retention_enabled: true
  retention_delete_delay: 2h
```

Compactor chạy nền, xóa data cũ hơn 31 ngày. `retention_delete_delay: 2h` là buffer để tránh xóa nhầm data đang được query.

**Những thông số để default (không cần khai báo):**

| Thông số | Default | Lý do bỏ |
|---|---|---|
| `frontend.encoding` | `protobuf` từ Loki 3.x | Trùng default |
| `compactor.compaction_interval` | `10m` | Trùng default |
| `tsdb_shipper.cache_ttl` | `24h` | Trùng default |
| `instance_addr` | — | Docker DNS tự xử lý |

---

### tempo.yaml

**Các quyết định quan trọng:**

- **OTLP là ingestion method duy nhất:** Không bật Jaeger/Zipkin receiver để giữ config gọn. Thêm vào `distributor.receivers` nếu cần.
- **`max_block_bytes: 1_000_000` (~1MB):** Giảm từ 5MB về 1MB (default) để an toàn hơn với RAM của VPS đơn.
- **Metrics generator:** Tự động derive RED metrics (Rate, Error, Duration) và Service Graph từ trace spans, đẩy vào Prometheus. Đây là thứ tạo ra tab "Service Map" trong Grafana.
- **`generate_native_histograms: both`:** Gửi cả classic và native histogram vì Prometheus đã bật `--enable-feature=native-histograms`. Nếu tắt flag đó, đổi về `classic`.
- **`local-blocks` processor:** Bắt buộc để TraceQL metric queries hoạt động trong Grafana.
- **`send_exemplars: true`:** Gắn traceID vào Prometheus metrics, cho phép click từ metric spike → trace tương ứng trong Grafana.

**Retention:**

```yaml
compactor:
  compaction:
    block_retention: 336h          # 14 ngày traces
    compacted_block_retention: 1h  # Xóa block gốc sau 1h kể từ khi compact xong
```

---

### alloy-config.alloy

**Pipeline tổng quan:**

```
Docker socket ──► discovery.docker
                      │
                      ├──► discovery.relabel "docker_metrics"
                      │         └──► prometheus.scrape ──► prometheus.remote_write ──► Prometheus
                      │
                      └──► discovery.relabel "docker_logs"
                                └──► loki.source.docker ──► loki.process ──► loki.write ──► Loki

prometheus.exporter.self ──► prometheus.scrape ──► prometheus.remote_write ──► Prometheus

otelcol.receiver.otlp (4317/4318)
    └──► otelcol.processor.batch
              ├──► otelcol.exporter.otlp ──► Tempo
              ├──► otelcol.exporter.prometheus ──► Prometheus
              └──► otelcol.exporter.loki ──► Loki
```

**Opt-in metrics scraping cho container:**

Container muốn được scrape metrics phải có Docker labels:

```yaml
# Trong docker-compose.yml của project khác
services:
  my-app:
    labels:
      prometheus.io/scrape: "true"
      prometheus.io/port: "8080"
      prometheus.io/path: "/metrics"   # optional, default /metrics
```

**Log collection:** Tất cả container đều được collect log tự động, không cần label.

**Lưu ý relabel port (đã fix):**

Bản gốc có bug — `replacement` dùng string literal thay vì interpolate IP thực. Đã fix thành 2 rule tách biệt:
```javascript
// Rule 1: extract IP
rule { source_labels = ["__address__"]; regex = "([^:]+):.*"; target_label = "__address__" }
// Rule 2: ghép port
rule { source_labels = ["__address__", "__meta_docker_container_label_prometheus_io_port"]; separator = ":"; target_label = "__address__" }
```

**`loki.source.docker` dùng `.output` không phải `.targets`:**

```javascript
// SAI — targets không có labels đã enrich
targets = discovery.docker.containers.targets

// ĐÚNG — targets đã có đầy đủ labels từ relabel
targets = discovery.relabel.docker_logs.output
```

---

### datasources.yaml

Grafana tự động provision 3 datasource khi khởi động. **Không cần cấu hình tay.**

**Wiring 3 chiều giữa các datasource:**

| Từ | Đến | Tính năng |
|---|---|---|
| Prometheus exemplars | Tempo | Click metric spike → trace |
| Loki derived fields | Tempo | Click traceID trong log → trace |
| Tempo tracesToLogsV2 | Loki | Click span → log của service đó |
| Tempo tracesToMetrics | Prometheus | Click span → RED metrics |
| Tempo serviceMap | Prometheus | Service dependency graph |

**`editable: false`:** Ngăn Grafana ghi đè file provisioning khi user thay đổi trên UI. Muốn cho phép edit thì đổi thành `true`.

---

## 6. Data flow

### Logs
```
Container stdout/stderr
  → Docker JSON log files (/var/lib/docker/containers/)
  → loki.source.docker (Alloy)
  → loki.process [parse JSON, promote level label, drop health checks]
  → loki.write
  → Loki :3100
```

### Metrics
```
Container /metrics endpoint (opt-in)
  → discovery.docker + discovery.relabel (Alloy)
  → prometheus.scrape
  → prometheus.remote_write
  → Prometheus :9090 /api/v1/write

Alloy self-metrics
  → prometheus.exporter.self
  → prometheus.scrape
  → prometheus.remote_write
  → Prometheus :9090 /api/v1/write

Tempo span-derived metrics
  → metrics_generator (Tempo)
  → remote_write
  → Prometheus :9090 /api/v1/write
```

### Traces
```
Instrumented app
  → OTLP gRPC :4317 / HTTP :4318 (Alloy)
  → otelcol.processor.batch
  → otelcol.exporter.otlp
  → Tempo :4317
```

---

## 7. Lưu ý quan trọng

### ⚠️ Container Prometheus không được gán label `prometheus.io/scrape=true`

Nếu container `global_prometheus` có label đó, Alloy sẽ scrape và push metrics Prometheus vào Prometheus — trong khi Prometheus đang tự scrape chính nó qua `prometheus.yml`. Kết quả là double-collect.

**Kiểm tra:** Đảm bảo service `prometheus` trong `docker-compose.yml` không có label `prometheus.io/scrape: "true"`.

---

### ℹ️ `generate_native_histograms` phải đồng bộ với Prometheus

| Prometheus flag | Giá trị nên dùng trong tempo.yaml |
|---|---|
| `--enable-feature=native-histograms` có | `both` |
| Không có flag trên | `classic` |

Stack hiện tại đã bật flag → dùng `both`.

---

### ℹ️ Schema Loki không thể thay đổi sau khi có data

Nếu cần upgrade schema (ví dụ lên v14 khi có), thêm entry mới:

```yaml
schema_config:
  configs:
    - from: "2024-01-01"
      store: tsdb
      schema: v13          # entry cũ, giữ nguyên
      ...
    - from: "2025-06-01"   # ngày trong tương lai
      store: tsdb
      schema: v14          # schema mới
      ...
```

---

### ℹ️ Alloy không cần `--storage.path` trong setup này

Alloy hoạt động như stateless collector — đọc từ Docker socket và forward đi. Không có WAL thì worst case khi restart là gap vài giây trong metrics/logs. Với `restart: unless-stopped` thì Alloy tự recover nhanh.

Chỉ cần thêm storage khi dùng `otelcol.processor.memory_limiter` hoặc file-based queue để buffer khi backend down.

---

## 8. Tích hợp ứng dụng

### Gửi traces từ app khác (Docker project khác)

App cần join network `global_lgtm` và gửi OTLP đến Alloy:

```yaml
# docker-compose.yml của project app
services:
  my-app:
    networks:
      - global_lgtm
    environment:
      OTEL_EXPORTER_OTLP_ENDPOINT: http://global_alloy:4317
      OTEL_SERVICE_NAME: my-app

networks:
  global_lgtm:
    external: true
```

Hoặc gửi qua host nếu không cùng network:
```
OTLP gRPC: host-ip:4317
OTLP HTTP: host-ip:4318
```

### Bật metrics scraping cho container

```yaml
services:
  my-app:
    labels:
      prometheus.io/scrape: "true"
      prometheus.io/port: "8080"
      prometheus.io/path: "/metrics"   # bỏ qua nếu dùng /metrics mặc định
```

### Spring Boot (actuator)

```yaml
labels:
  prometheus.io/scrape: "true"
  prometheus.io/port: "8080"
  prometheus.io/path: "/actuator/prometheus"
```

### ASP.NET Core

```yaml
labels:
  prometheus.io/scrape: "true"
  prometheus.io/port: "5000"
  prometheus.io/path: "/metrics"
```

---

## 9. Upgrade & bảo trì

### Hot-reload Prometheus config (không restart)

```bash
curl -X POST http://localhost:9090/-/reload
```

### Kiểm tra Loki ingestion

```bash
curl http://localhost:3100/ready
curl http://localhost:3100/metrics | grep loki_ingester
```

### Upgrade image version

```bash
docker compose pull          # pull image mới nhất
docker compose up -d         # recreate container với image mới
docker image prune -f        # dọn image cũ
```

### Backup data volumes

```bash
# Backup Grafana dashboards & settings
docker run --rm \
  -v grafana_data:/data \
  -v $(pwd)/backup:/backup \
  alpine tar czf /backup/grafana-$(date +%Y%m%d).tar.gz /data
```

### Pin version khi chuyển production

Thay `latest` bằng version cụ thể trong `docker-compose.yml`:

```yaml
image: prom/prometheus:v3.4.1
image: grafana/loki:3.5.1
image: grafana/tempo:2.7.2
image: grafana/alloy:v1.9.1
image: grafana/grafana:12.0.1
```
