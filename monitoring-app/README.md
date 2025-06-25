

# Install and set up

## Dev
./generate_prometheus_config.sh dev
pnpm run dev
docker compose up --build prometheus


## Prod
./generate_prometheus_config.sh prod
docker compose up --build