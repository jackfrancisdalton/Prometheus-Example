import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry = new client.Registry();

  public readonly requestCount = new client.Counter({
    name: 'metrics_api_requests_total',
    help: 'Total number of HTTP requests received by metrics-api',
  });

  public readonly uptimeGauge = new client.Gauge({
    name: 'metrics_api_uptime_seconds',
    help: 'How long the metrics-api has been running',
  });

  public readonly requestDuration = new client.Histogram({
    name: 'metrics_api_request_duration_seconds',
    help: 'Duration of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.05, 0.1, 0.3, 1, 5],
  });

  onModuleInit() {
    client.collectDefaultMetrics({ register: this.registry });
    this.registry.registerMetric(this.requestCount);
    this.registry.registerMetric(this.uptimeGauge);
    this.registry.registerMetric(this.requestDuration);

    setInterval(() => {
      this.uptimeGauge.set(process.uptime());
    }, 5000);
  }

  getMetrics() {
    return this.registry.metrics();
  }
}