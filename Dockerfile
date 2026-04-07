FROM node:20-alpine

# Install build tools for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy server package
COPY packages/server ./packages/server

# Install dependencies
RUN pnpm install

# Rebuild better-sqlite3 native module using npm (bypasses pnpm script blocking)
WORKDIR /app/node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3
RUN npm run build-release
WORKDIR /app

# Build shared package first
RUN pnpm --filter @lme/shared build

# Build server
RUN pnpm --filter @lme/server build

WORKDIR /app/packages/server

ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/index.js"]
