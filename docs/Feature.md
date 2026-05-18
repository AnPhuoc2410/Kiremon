**Đăng nhập/liên kết tài khoản bên thứ 3**: thêm OAuth2/OpenID Connect (Google/Microsoft/GitHub); lưu mapping providerId để tránh đụng username; cho phép unlink trong trang Profile.

**Thông báo real-time**: đẩy qua SignalR + web push (VAPID) để báo bắt Pokémon thành công, sự kiện hiếm, hoặc nhắc nhiệm vụ ngày.

**Phân tích hành vi**: gửi sự kiện ẩn danh vào một hàng đợi (Kafka/Event Hub) rồi phân tích ở job nền; tuyệt đối không log PII.

**Anti-abuse/rate-limit**: dùng rate limiting theo IP + user, thêm reCAPTCHA/hCaptcha cho signup/login bất thường.

**Lưu trữ media**: nếu cho phép upload avatar, dùng S3-compatible + presigned URL; resize & AVIF/WebP; quét virus trước khi lưu.

**Audit & quan sát**: thêm structured logging (Serilog + OpenTelemetry), correlationId per request, cảnh báo 5xx/surge.

**Mở rộng dữ liệu Pokémon**: cache PokeAPI kết hợp snapshot định kỳ; feature toggle để rollout dần các thế hệ mới.

**Marketplace trao đổi Pokémon**: thêm escrow logic, check quyền sở hữu, log giao dịch, và rule chống giao dịch bất thường.

**Mobile push**: nếu có app/SPA hỗ trợ PWA, đăng ký push token và quản lý opt-in/opt-out.

**GAME Feature**
Trading system - Đổi Pokemon với người khác
Battle experience - Tăng XP và EVs khi chiến đấu
Evolution - Tiến hóa Pokemon khi đủ điều kiện
Leaderboard - Xếp hạng trainer theo collection