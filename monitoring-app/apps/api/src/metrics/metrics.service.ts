import { Injectable } from '@nestjs/common';
import { Counter, Histogram, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  public readonly pollsCreatedCounter: Counter<string>;
  public readonly pollVotesCounter: Counter<string>;
  public readonly pollsDeletedCounter: Counter<string>;

  public readonly httpRequestsCounter: Counter<string>;
  public readonly httpRequestDurationHistogram: Histogram<string>;

  constructor() {
    this.pollsCreatedCounter = new Counter({
      name: 'polls_created_total',
      help: 'Total number of polls created',
      registers: [this.registry],
    });

    this.pollVotesCounter = new Counter({
      name: 'poll_votes_total',
      help: 'Total number of votes submitted',
      registers: [this.registry],
    });

    this.pollsDeletedCounter = new Counter({
      name: 'poll_deleted_total',
      help: 'Total number of polls deleted',
      registers: [this.registry],
    });
    
    this.httpRequestDurationHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      buckets: [0.1, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.httpRequestsCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total HTTP requests received',
      labelNames: ['method', 'route'],
      registers: [this.registry],
    });
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
