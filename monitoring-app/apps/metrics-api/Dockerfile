FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter metrics-api build

# ---
FROM node:22-alpine AS runner

WORKDIR /app

# Copy full app and node_modules for runtime
COPY --from=builder /app /app

CMD ["node", "apps/metrics-api/dist/main"]
