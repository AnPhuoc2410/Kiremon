# =====================
# Build stage
# =====================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# 1. Copy các file csproj để restore trước (Tận dụng Docker Layer Caching)
COPY PokedexReactASP.Domain/PokedexReactASP.Domain.csproj PokedexReactASP.Domain/
COPY PokedexReactASP.Application/PokedexReactASP.Application.csproj PokedexReactASP.Application/
COPY PokedexReactASP.Infrastructure/PokedexReactASP.Infrastructure.csproj PokedexReactASP.Infrastructure/
COPY PokedexReactASP.Server/PokedexReactASP.Server.csproj PokedexReactASP.Server/

# Giúp Self-hosted Runner không phải tải lại các gói từ internet nếu có sự thay đổi nhỏ ở mã nguồn.
RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet restore "PokedexReactASP.Server/PokedexReactASP.Server.csproj" /p:Configuration=Release

# 2. Copy toàn bộ source code còn lại và tiến hành publish
COPY . .
WORKDIR /src/PokedexReactASP.Server

RUN --mount=type=cache,id=nuget,target=/root/.nuget/packages \
    dotnet publish -c Release -o /app/publish 

# =====================
# Runtime stage
# =====================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine

# Cài đặt thư viện ICU để hỗ trợ Globalization (Tiếng Việt, sắp xếp dữ liệu, múi giờ)
RUN apk add --no-cache icu-libs

ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
    DOTNET_GC_SERVER=1 \
    DOTNET_RUNNING_IN_CONTAINER=true

WORKDIR /app

COPY --from=build --chown=app:app /app/publish .

USER app
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:8080/health > /dev/null || exit 1

ENTRYPOINT ["dotnet", "PokedexReactASP.Server.dll"]