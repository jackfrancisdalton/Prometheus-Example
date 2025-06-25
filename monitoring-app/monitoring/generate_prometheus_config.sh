#!/bin/bash

# Default to prod
MODE="${1:-prod}"

if [ "$MODE" = "dev" ]; then
  export METRICS_API_TARGET="host.docker.internal:3001"
  export API_TARGET="host.docker.internal:3000"
else
  export METRICS_API_TARGET="metrics-api:3001"
  export API_TARGET="api:3000"
fi

# Generate prometheus.yml
envsubst < prometheus.yml.template > prometheus.yml
echo "Generated prometheus.yml for mode: $MODE"