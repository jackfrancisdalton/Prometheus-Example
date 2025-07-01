// polls.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PollsMapper } from 'src/polls/utils/polls-mapper';
import { MetricsService } from 'src/metrics/metrics.service';
import { Poll } from './entities/poll.entity';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
@Injectable()
export class PollsGateway implements OnGatewayInit {

  constructor(
    private readonly metricsService: MetricsService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @OnEvent('poll.created')
  handlePollCreated(poll: Poll) {
    this.metricsService.pollVotesCounter.inc();
    const end = this.metricsService.webhookDurationHistogram.startTimer({
      webhook: 'pollCreate',
    });

    const response = PollsMapper.toPollResponse(poll);
    this.server.emit('pollCreate', response);
    end();
  }

  @OnEvent('poll.voted')
  handlePollVoted(poll: Poll) {
    this.metricsService.pollVotesCounter.inc();
    const end = this.metricsService.webhookDurationHistogram.startTimer({
      webhook: 'pollUpdate',
    });

    const response = PollsMapper.toPollResponse(poll);

    this.server.emit('pollUpdate', response);
    end();
  }

  @OnEvent('poll.deleted')
  handlePollDeleted(payload: { pollId: number }) {
    this.metricsService.pollsDeletedCounter.inc();
    const end = this.metricsService.webhookDurationHistogram.startTimer({
      webhook: 'pollDelete',
    });

    this.server.emit('pollDelete', payload.pollId);
    end();
  }
}
