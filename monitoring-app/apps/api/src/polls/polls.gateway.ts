import {
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  import { Injectable } from '@nestjs/common';
  import { Poll } from '../entities/poll.entity';
  
  @WebSocketGateway({
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  })
  @Injectable()
  export class PollsGateway {
    @WebSocketServer()
    server: Server;
  
    broadcastPollUpdate(updatedPoll: Poll) {
      this.server.emit('pollUpdate', updatedPoll);
    }
  }