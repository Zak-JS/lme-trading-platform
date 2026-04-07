FROM node:20-alpine

WORKDIR /app

# Copy root package files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy server package
COPY packages/server ./packages/server

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared package first
RUN pnpm --filter @lme/shared build

# Build server
RUN pnpm --filter @lme/server build

WORKDIR /app/packages/server

EXPOSE 3001

CMD ["node", "dist/index.js"]
