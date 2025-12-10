#!/bin/bash
# =========================================
# KIREMON API DEPLOYMENT SCRIPT
# Usage: ./deploy.sh [--build] [--down] [--logs]
# =========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Auto detect project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"

# Functions
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_status "Checking requirements..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check .env file
    if [ ! -f "$PROJECT_DIR/$ENV_FILE" ]; then
        print_error ".env file not found. Please copy env.production.example to .env and configure it."
        exit 1
    fi
    
    print_success "All requirements met!"
}

pull_latest() {
    print_status "Pulling latest changes from Git..."
    cd "$PROJECT_DIR"
    git fetch origin
    git pull origin main
    print_success "Code updated!"
}

build_images() {
    print_status "Building Docker image..."
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" build --no-cache
    print_success "Image built successfully!"
}

deploy() {
    print_status "Deploying API..."
    cd "$PROJECT_DIR"
    
    # Stop existing containers gracefully
    print_status "Stopping existing container..."
    docker compose -f "$COMPOSE_FILE" down --remove-orphans || true
    
    # Start new container
    print_status "Starting container..."
    docker compose -f "$COMPOSE_FILE" up -d
    
    # Wait for service to be healthy
    print_status "Waiting for API to be healthy..."
    sleep 10
    
    # Check container status
    docker compose -f "$COMPOSE_FILE" ps
    
    print_success "Deployment completed!"
}

show_logs() {
    print_status "Showing logs (Ctrl+C to exit)..."
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" logs -f
}

cleanup() {
    print_status "Cleaning up unused Docker resources..."
    docker system prune -f
    docker image prune -f
    print_success "Cleanup completed!"
}

health_check() {
    print_status "Running health check..."
    
    # Check API
    if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
        print_success "API is healthy!"
        curl -s http://localhost:5000/health | head -c 200
        echo ""
    else
        print_warning "API health check failed (might still be starting)"
    fi
}

show_status() {
    print_status "Container Status:"
    cd "$PROJECT_DIR"
    docker compose -f "$COMPOSE_FILE" ps
    echo ""
    print_status "Resource Usage:"
    docker stats --no-stream kiremon_api 2>/dev/null || echo "Container not running"
}

# Main script
case "$1" in
    --build)
        check_requirements
        pull_latest
        build_images
        deploy
        cleanup
        health_check
        ;;
    --down)
        print_status "Stopping container..."
        cd "$PROJECT_DIR"
        docker compose -f "$COMPOSE_FILE" down
        print_success "Container stopped!"
        ;;
    --logs)
        show_logs
        ;;
    --status)
        show_status
        ;;
    --health)
        health_check
        ;;
    --cleanup)
        cleanup
        ;;
    --restart)
        print_status "Restarting API..."
        cd "$PROJECT_DIR"
        docker compose -f "$COMPOSE_FILE" restart
        sleep 5
        health_check
        ;;
    *)
        # Default: pull and deploy without rebuild
        check_requirements
        pull_latest
        deploy
        health_check
        ;;
esac

echo ""
print_status "========================================="
print_status "Deployment script finished!"
print_status "========================================="
