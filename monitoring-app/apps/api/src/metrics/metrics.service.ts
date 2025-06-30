import { Injectable } from '@nestjs/common';
import { Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();

  public readonly pollsCreatedCounter: Counter<string>;
  public readonly pollVotesCounter: Counter<string>;
  public readonly pollsDeletedCounter: Counter<string>;

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
    
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
