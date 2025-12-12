# =========================================
# Stage 1: Build
# =========================================
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

# Copy csproj files first for better layer caching
COPY PokedexReactASP.Domain/PokedexReactASP.Domain.csproj PokedexReactASP.Domain/
COPY PokedexReactASP.Application/PokedexReactASP.Application.csproj PokedexReactASP.Application/
COPY PokedexReactASP.Infrastructure/PokedexReactASP.Infrastructure.csproj PokedexReactASP.Infrastructure/
COPY PokedexReactASP.Server/PokedexReactASP.Server.csproj PokedexReactASP.Server/

# Restore dependencies (cached if csproj files unchanged)
WORKDIR /src/PokedexReactASP.Server
RUN dotnet restore "PokedexReactASP.Server.csproj" --runtime linux-musl-x64

# Copy remaining source code
WORKDIR /src
COPY PokedexReactASP.Domain/ PokedexReactASP.Domain/
COPY PokedexReactASP.Application/ PokedexReactASP.Application/
COPY PokedexReactASP.Infrastructure/ PokedexReactASP.Infrastructure/
COPY PokedexReactASP.Server/ PokedexReactASP.Server/

# Build and publish
WORKDIR /src/PokedexReactASP.Server
RUN dotnet publish "PokedexReactASP.Server.csproj" \
    -c Release \
    -o /app/publish \
    --runtime linux-musl-x64 \
    --self-contained false \
    --no-restore \
    /p:PublishTrimmed=false \
    /p:PublishSingleFile=false

# =========================================
# Stage 2: Runtime (Alpine for smaller size)
# =========================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

WORKDIR /app

# Copy published app
COPY --from=build --chown=appuser:appuser /app/publish .

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "PokedexReactASP.Server.dll"]
