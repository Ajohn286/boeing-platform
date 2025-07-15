# *******************
# Project        : Airbus Review LHM
# File           : Dockerfile
# Version        : v1.0  Last update: 01/08/2025 15:30 EST
# Status         : Supports: UV | PNP
# Classification : CUI//SP-CTI
# Purpose        : Multi-stage Docker build for Airbus platform
# Workflow       : MAIN
# Core Module    : yes
# App Functionality : [containerization]
# Dependencies
#   * Called by       : docker-compose.yml, deployment scripts
#   * Calls           : package.json build scripts
#   * Libraries       : Node.js, npm
#   * Infrastructure  : Docker
# Change Log
#   * v1.0 (01/08/2025): Initial creation for Docker deployment
# Description     : Multi-stage Dockerfile building both client and server components
# *******************

# Stage 1: Build the client (React/Vite)
FROM node:18-alpine AS client-builder

WORKDIR /app

# Copy client package files
COPY client/package*.json ./client/
COPY package*.json ./

# Install dependencies
RUN cd client && npm ci --only=production

# Copy client source code
COPY client/ ./client/
COPY shared/ ./shared/
COPY tsconfig.json ./
COPY vite.config.ts ./

# Build the client
RUN cd client && npm run build

# Stage 2: Build the server
FROM node:18-alpine AS server-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production

# Copy server source code
COPY server/ ./server/
COPY shared/ ./shared/
COPY tsconfig.json ./

# Build the server (if needed)
RUN npm run check

# Stage 3: Production image
FROM node:18-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=server-builder /app/server ./server
COPY --from=server-builder /app/shared ./shared
COPY --from=client-builder /app/client/dist ./client/dist
COPY --from=server-builder /app/tsconfig.json ./

# Copy additional config files
COPY drizzle.config.ts ./
COPY vite.config.ts ./

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"] 