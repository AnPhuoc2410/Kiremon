#!/bin/bash
# =========================================
# KIREMON VPS INITIAL SETUP SCRIPT
# Tested on: Ubuntu 22.04 LTS
# =========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

# Configuration
PROJECT_DIR="/opt/kiremon"
GITHUB_REPO="https://github.com/AnPhuoc2410/Kiremon.git"

print_status "========================================="
print_status "KIREMON API - VPS SETUP SCRIPT"
print_status "========================================="

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
apt install -y curl wget git unzip htop ufw

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    usermod -aG docker $USER
    systemctl enable docker
    systemctl start docker
    
    print_success "Docker installed!"
else
    print_warning "Docker already installed, skipping..."
fi

# Setup firewall
print_status "Configuring firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 5000/tcp  # API port
ufw --force enable
print_success "Firewall configured!"

# Create project directory
print_status "Creating project directory..."
mkdir -p "$PROJECT_DIR"

# Clone repository
print_status "Cloning repository..."
if [ -d "$PROJECT_DIR/.git" ]; then
    print_warning "Repository already exists, pulling latest..."
    cd "$PROJECT_DIR"
    git pull origin main
else
    git clone "$GITHUB_REPO" "$PROJECT_DIR"
fi

# Setup environment file
print_status "Setting up environment file..."
if [ ! -f "$PROJECT_DIR/.env" ]; then
    cp "$PROJECT_DIR/env.production.example" "$PROJECT_DIR/.env"
    print_warning "⚠️  Please edit $PROJECT_DIR/.env with your production values!"
else
    print_warning ".env file already exists, skipping..."
fi

# Make deploy script executable
chmod +x "$PROJECT_DIR/deploy/deploy.sh"

# Create systemd service for auto-start
print_status "Creating systemd service..."
cat > /etc/systemd/system/kiremon.service << 'EOF'
[Unit]
Description=Kiremon API
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/kiremon
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable kiremon.service

print_success "========================================="
print_success "VPS SETUP COMPLETED!"
print_success "========================================="
echo ""
print_status "Next steps:"
echo "  1. Edit .env file:"
echo "     nano $PROJECT_DIR/.env"
echo ""
echo "  2. Deploy the API:"
echo "     cd $PROJECT_DIR && ./deploy/deploy.sh --build"
echo ""
echo "  3. Test API:"
echo "     curl http://YOUR_VPS_IP:5000/health"
echo ""
print_warning "NOTE: Log out and back in for Docker group permissions."
