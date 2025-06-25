FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter web build

# ---
FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf