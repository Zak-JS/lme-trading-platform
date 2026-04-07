FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy shared package (needed for types)
COPY packages/shared ./packages/shared

# Copy client package
COPY packages/client ./packages/client

# Install dependencies
RUN pnpm install

# Build shared package first
RUN pnpm --filter @lme/shared build

# Build client
RUN pnpm --filter @lme/client build

# Serve with a simple static server
RUN npm install -g serve

WORKDIR /app/packages/client

ENV PORT=3000
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
