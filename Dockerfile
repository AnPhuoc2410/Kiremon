# =====================
# Build stage
# =====================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

COPY PokedexReactASP.Domain/PokedexReactASP.Domain.csproj PokedexReactASP.Domain/
COPY PokedexReactASP.Application/PokedexReactASP.Application.csproj PokedexReactASP.Application/
COPY PokedexReactASP.Infrastructure/PokedexReactASP.Infrastructure.csproj PokedexReactASP.Infrastructure/
COPY PokedexReactASP.Server/PokedexReactASP.Server.csproj PokedexReactASP.Server/

RUN sed -i '/.esproj/d' PokedexReactASP.Server/PokedexReactASP.Server.csproj

RUN dotnet restore "PokedexReactASP.Server/PokedexReactASP.Server.csproj"

COPY . .
WORKDIR /src/PokedexReactASP.Server
RUN dotnet publish -c Release -o /app/publish --no-restore

# =====================
# Runtime stage
# =====================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

RUN apk add --no-cache icu-libs

# 2. Tắt chế độ Invariant để app chạy ổn định với Database/Tiếng Việt
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    DOTNET_GC_SERVER=1 \
    DOTNET_RUNNING_IN_CONTAINER=true

RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app
COPY --from=build --chown=appuser:appuser /app/publish .

USER appuser
EXPOSE 8080

# -q: Quiet (không hiện log tải)
# -O-: In ra màn hình (thay vì lưu file)
# > /dev/null: Bỏ qua output, chỉ quan tâm exit code
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/health > /dev/null || exit 1

ENTRYPOINT ["dotnet", "PokedexReactASP.Server.dll"]