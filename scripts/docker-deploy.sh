#!/bin/bash

# *******************
# Project        : Airbus Review LHM
# File           : scripts/docker-deploy.sh
# Version        : v1.0  Last update: 01/08/2025 15:30 EST
# Status         : Supports: UV | PNP
# Classification : CUI//SP-CTI
# Purpose        : Docker deployment automation script
# Workflow       : MAIN
# Core Module    : yes
# App Functionality : [deployment-automation]
# Dependencies
#   * Called by       : deployment pipeline, manual execution
#   * Calls           : docker-compose commands
#   * Libraries       : Docker, Docker Compose
#   * Infrastructure  : Docker
# Change Log
#   * v1.0 (01/08/2025): Initial creation for Docker deployment
# Description     : Automated script for building and deploying Airbus containers
# *******************

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="airbus-review-lhm"
DOCKER_COMPOSE_FILE="docker-compose.yml"
DOCKER_COMPOSE_DEV_FILE="docker-compose.dev.yml"

# Functions
print_banner() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "  Airbus Review LHM - Docker Deployment Script"
    echo "=================================================="
    echo -e "${NC}"
}

print_step() {
    echo -e "${YELLOW}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

check_requirements() {
    print_step "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

build_images() {
    print_step "Building Docker images..."
    
    if [ "$1" = "dev" ]; then
        docker-compose -f $DOCKER_COMPOSE_DEV_FILE build --no-cache
    else
        docker-compose -f $DOCKER_COMPOSE_FILE build --no-cache
    fi
    
    print_success "Images built successfully"
}

start_services() {
    print_step "Starting services..."
    
    if [ "$1" = "dev" ]; then
        docker-compose -f $DOCKER_COMPOSE_DEV_FILE up -d
        echo ""
        echo -e "${GREEN}Development environment started!${NC}"
        echo -e "${BLUE}Frontend: http://localhost:5173${NC}"
        echo -e "${BLUE}Backend: http://localhost:5000${NC}"
        echo -e "${BLUE}Database Admin: http://localhost:8080${NC}"
    else
        docker-compose -f $DOCKER_COMPOSE_FILE up -d
        echo ""
        echo -e "${GREEN}Production environment started!${NC}"
        echo -e "${BLUE}Application: http://localhost:5000${NC}"
        echo -e "${BLUE}Database Admin: http://localhost:8080${NC}"
    fi
    
    print_success "Services started successfully"
}

stop_services() {
    print_step "Stopping services..."
    
    if [ "$1" = "dev" ]; then
        docker-compose -f $DOCKER_COMPOSE_DEV_FILE down
    else
        docker-compose -f $DOCKER_COMPOSE_FILE down
    fi
    
    print_success "Services stopped successfully"
}

show_logs() {
    print_step "Showing logs..."
    
    if [ "$1" = "dev" ]; then
        docker-compose -f $DOCKER_COMPOSE_DEV_FILE logs -f
    else
        docker-compose -f $DOCKER_COMPOSE_FILE logs -f
    fi
}

show_status() {
    print_step "Service status:"
    
    if [ "$1" = "dev" ]; then
        docker-compose -f $DOCKER_COMPOSE_DEV_FILE ps
    else
        docker-compose -f $DOCKER_COMPOSE_FILE ps
    fi
}

cleanup() {
    print_step "Cleaning up Docker resources..."
    
    # Stop and remove containers
    if [ "$1" = "dev" ]; then
        docker-compose -f $DOCKER_COMPOSE_DEV_FILE down -v --remove-orphans
    else
        docker-compose -f $DOCKER_COMPOSE_FILE down -v --remove-orphans
    fi
    
    # Remove unused images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
    
    print_success "Cleanup completed"
}

show_help() {
    echo "Usage: $0 [COMMAND] [ENVIRONMENT]"
    echo ""
    echo "Commands:"
    echo "  build     Build Docker images"
    echo "  start     Start services"
    echo "  stop      Stop services"
    echo "  restart   Restart services"
    echo "  logs      Show service logs"
    echo "  status    Show service status"
    echo "  cleanup   Clean up Docker resources"
    echo "  help      Show this help message"
    echo ""
    echo "Environment:"
    echo "  prod      Production environment (default)"
    echo "  dev       Development environment"
    echo ""
    echo "Examples:"
    echo "  $0 start dev     # Start development environment"
    echo "  $0 build prod    # Build production images"
    echo "  $0 logs          # Show production logs"
}

# Main script
print_banner

# Parse arguments
COMMAND=${1:-help}
ENVIRONMENT=${2:-prod}

# Validate environment
if [ "$ENVIRONMENT" != "prod" ] && [ "$ENVIRONMENT" != "dev" ]; then
    print_error "Invalid environment. Use 'prod' or 'dev'"
    exit 1
fi

case $COMMAND in
    build)
        check_requirements
        build_images $ENVIRONMENT
        ;;
    start)
        check_requirements
        start_services $ENVIRONMENT
        ;;
    stop)
        stop_services $ENVIRONMENT
        ;;
    restart)
        check_requirements
        stop_services $ENVIRONMENT
        start_services $ENVIRONMENT
        ;;
    logs)
        show_logs $ENVIRONMENT
        ;;
    status)
        show_status $ENVIRONMENT
        ;;
    cleanup)
        cleanup $ENVIRONMENT
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac 