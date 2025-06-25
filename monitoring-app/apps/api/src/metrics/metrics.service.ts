import { Injectable, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
    private readonly registry = new client.Registry();
  
    public readonly pollCreated = new client.Counter({
      name: 'polls_created_total',
      help: 'Total number of polls created',
    });
  
    public readonly votesCast = new client.Counter({
      name: 'votes_cast_total',
      help: 'Total number of votes cast',
    });
  
    public readonly httpDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5],
    });
  
    onModuleInit() {
      client.collectDefaultMetrics({ register: this.registry });
      this.registry.registerMetric(this.pollCreated);
      this.registry.registerMetric(this.votesCast);
      this.registry.registerMetric(this.httpDuration);
    }
  
    getMetrics() {
      return this.registry.metrics();
    }
  
    getRegistry() {
      return this.registry;
    }
  }