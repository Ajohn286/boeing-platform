# Airbus Review LHM - Docker Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Airbus Review LHM platform using Docker containers. The setup includes both development and production configurations with supporting services.

## Prerequisites

- Docker (v20.0 or later)
- Docker Compose (v2.0 or later)
- Git
- 4GB+ available RAM
- 10GB+ available disk space

## Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd airbus-1
git checkout airbus-review-lhm
```

### 2. Configure Environment
```bash
# Copy and customize environment variables
cp env.example .env
# Edit .env with your specific configuration
```

### 3. Deploy Development Environment
```bash
# Make deployment script executable
chmod +x scripts/docker-deploy.sh

# Start development environment
./scripts/docker-deploy.sh start dev
```

### 4. Deploy Production Environment
```bash
# Build and start production environment
./scripts/docker-deploy.sh build prod
./scripts/docker-deploy.sh start prod
```

## Architecture

### Services Overview

| Service | Port | Purpose | Environment |
|---------|------|---------|-------------|
| airbus-app | 5000 | Main application | Production |
| airbus-dev | 5173, 5000 | Dev app with hot reload | Development |
| postgres | 5432 | PostgreSQL database | Both |
| redis | 6379 | Cache and sessions | Both |
| adminer | 8080 | Database admin UI | Both |

### Network Architecture
- **Network**: `airbus-network` (172.20.0.0/16)
- **Service Discovery**: Internal DNS resolution
- **Health Checks**: Automatic service monitoring

## Configuration

### Environment Variables

Key configuration options in `.env`:

```bash
# Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://airbus_user:airbus_pass@postgres:5432/airbus_db

# Redis
REDIS_URL=redis://redis:6379

# Auth0 (configure with your values)
AUTH0_SECRET=your-secret-here
AUTH0_CLIENT_ID=your-client-id
```

### Docker Compose Files

- `docker-compose.yml` - Production environment
- `docker-compose.dev.yml` - Development environment with hot reload
- `Dockerfile` - Production multi-stage build
- `Dockerfile.dev` - Development build with dev tools

## Deployment Commands

### Using the Deployment Script

```bash
# Show help
./scripts/docker-deploy.sh help

# Build images
./scripts/docker-deploy.sh build [prod|dev]

# Start services
./scripts/docker-deploy.sh start [prod|dev]

# Stop services
./scripts/docker-deploy.sh stop [prod|dev]

# Show logs
./scripts/docker-deploy.sh logs [prod|dev]

# Show service status
./scripts/docker-deploy.sh status [prod|dev]

# Clean up resources
./scripts/docker-deploy.sh cleanup [prod|dev]
```

### Manual Docker Compose Commands

```bash
# Production
docker-compose up -d
docker-compose down
docker-compose logs -f

# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f
```

## Development Workflow

### Hot Reload Setup
1. Start development environment: `./scripts/docker-deploy.sh start dev`
2. Code changes automatically trigger rebuilds
3. Frontend available at: http://localhost:5173
4. Backend available at: http://localhost:5000

### Volume Mounts
Development environment mounts source code for live editing:
- `./client` → `/app/client`
- `./server` → `/app/server`
- `./shared` → `/app/shared`

## Access Points

### Development Environment
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database Admin**: http://localhost:8080
- **Database**: localhost:5432

### Production Environment
- **Application**: http://localhost:5000
- **Database Admin**: http://localhost:8080
- **Database**: localhost:5432

## Monitoring and Debugging

### Health Checks
```bash
# Check service health
docker-compose ps

# View service logs
docker-compose logs [service-name]

# Execute commands in containers
docker-compose exec airbus-app sh
docker-compose exec postgres psql -U airbus_user -d airbus_db
```

### Common Issues

#### Port Conflicts
```bash
# Check port usage
netstat -tlnp | grep :5000
# Kill conflicting processes
sudo kill -9 <pid>
```

#### Database Connection Issues
```bash
# Verify database is running
docker-compose exec postgres pg_isready -U airbus_user

# Connect to database
docker-compose exec postgres psql -U airbus_user -d airbus_db
```

#### Memory Issues
```bash
# Check Docker resource usage
docker stats

# Clean up unused resources
docker system prune -a
```

## Production Considerations

### Security
- Change default passwords in `.env`
- Use proper SSL certificates
- Configure firewall rules
- Enable audit logging

### Performance
- Allocate sufficient resources (4GB+ RAM)
- Monitor container metrics
- Configure log rotation
- Set up backup procedures

### Scaling
- Use Docker Swarm or Kubernetes for clustering
- Configure load balancers
- Set up database replicas
- Implement caching strategies

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec postgres pg_dump -U airbus_user airbus_db > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U airbus_user -d airbus_db < backup.sql
```

### Volume Backup
```bash
# Backup volumes
docker run --rm -v airbus-1_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_data.tar.gz -C /data .

# Restore volumes
docker run --rm -v airbus-1_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_data.tar.gz -C /data
```

## Troubleshooting

### Container Won't Start
1. Check logs: `docker-compose logs [service]`
2. Verify environment variables
3. Check port availability
4. Ensure sufficient disk space

### Database Connection Failed
1. Verify database container is running
2. Check connection string format
3. Verify credentials
4. Check network connectivity

### Build Failures
1. Clear Docker cache: `docker system prune -a`
2. Check Dockerfile syntax
3. Verify base image availability
4. Ensure sufficient disk space

## Contributing

1. Create feature branch from `airbus-review-lhm`
2. Test changes in development environment
3. Update documentation if needed
4. Submit pull request

## Support

For issues and questions:
- Check container logs first
- Review this documentation
- Check Docker and Docker Compose versions
- Verify system requirements 