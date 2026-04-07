FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files for workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy shared package
COPY packages/shared ./packages/shared

# Copy server package
COPY packages/server ./packages/server

# Install dependencies using pnpm
RUN pnpm install

# Build shared package first
RUN pnpm --filter @lme/shared build

# Build server
RUN pnpm --filter @lme/server build

WORKDIR /app/packages/server

ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/index.js"]
