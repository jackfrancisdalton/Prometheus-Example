// polls.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PollsMapper } from 'src/polls/utils/polls-mapper';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
@Injectable()
export class PollsGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @OnEvent('poll.created')
  handlePollCreated(poll: any) {
    const response = PollsMapper.toPollResponse(poll);
    this.server.emit('pollCreate', response);
  }

  @OnEvent('poll.voted')
  handlePollVoted(poll: any) {
    const response = PollsMapper.toPollResponse(poll);
    this.server.emit('pollUpdate', response);
  }

  @OnEvent('poll.deleted')
  handlePollDeleted(payload: { pollId: number }) {
    this.server.emit('pollDelete', payload.pollId);
  }
}
