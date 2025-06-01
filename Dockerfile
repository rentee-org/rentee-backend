# Build stage
FROM node:20-alpine AS builder

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies
RUN --mount=type=cache,id=cache-yarn-${CI_COMMIT_REF_SLUG},target=/root/.yarn-cache \
    yarn install --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean

# Copy source code
COPY . .

# Build the application
RUN yarn build && \
    # Remove source files after build
    rm -rf src && \
    rm -rf test

# Production dependencies stage
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies and optimize
RUN --mount=type=cache,id=cache-yarn-${CI_COMMIT_REF_SLUG},target=/root/.yarn-cache \
    yarn install --production --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean && \
    # Remove unnecessary files from node_modules
    find node_modules -name "*.md" -delete && \
    find node_modules -name "*.txt" -delete && \
    find node_modules -name "LICENSE*" -delete && \
    find node_modules -name "CHANGELOG*" -delete && \
    find node_modules -name "*.map" -delete && \
    find node_modules -name "*.d.ts" -delete && \
    find node_modules -name ".DS_Store" -delete && \
    # Remove test directories
    find node_modules -name "__tests__" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "test" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "tests" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "spec" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "coverage" -type d -exec rm -rf {} + 2>/dev/null || true && \
    # Remove documentation directories
    find node_modules -name "docs" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "doc" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "website" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "example" -type d -exec rm -rf {} + 2>/dev/null || true && \
    find node_modules -name "examples" -type d -exec rm -rf {} + 2>/dev/null || true && \
    # Remove build tools and unnecessary binaries
    rm -rf node_modules/.bin || true

# Final production stage
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init && \
    # Remove package manager to save space
    rm -rf /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Copy dumb-init
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Copy optimized production dependencies
COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules

# Remove npm to save space (~40MB)
RUN rm -rf /usr/local/lib/node_modules/npm && \
    rm -rf /usr/local/bin/npm && \
    rm -rf /usr/local/bin/npx

# Switch to non-root user
USER nestjs

# Expose app port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=460"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the app with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]