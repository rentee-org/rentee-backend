# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies with correct cache mount syntax
RUN --mount=type=cache,target=/root/.yarn,id=yarn_cache \
    yarn install --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean

# Copy source code and build
COPY . .
RUN yarn build

# Production dependencies stage
FROM node:20-alpine AS deps

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json yarn.lock ./

# Install production dependencies with correct cache mount
RUN --mount=type=cache,target=/root/.yarn,id=yarn_cache \
    yarn install --production --frozen-lockfile --network-timeout 100000 && \
    yarn cache clean

# Final stage
FROM node:20-alpine

RUN apk add --no-cache dumb-init
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

ENV NODE_ENV=production \
    PORT=3000

EXPOSE ${PORT}

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]