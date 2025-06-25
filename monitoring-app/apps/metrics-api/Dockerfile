FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter metrics-api build

# ---
FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=builder /app/apps/metrics-api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/metrics-api/package.json ./package.json

CMD ["node", "dist/main"]