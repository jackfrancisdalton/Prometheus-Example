import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from 'src/polls/entities/poll.entity';
import { PollOption } from 'src/polls/entities/poll-option.entity';
import { Vote } from 'src/polls/entities/vote.entity';
import { PollsGateway } from './polls.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, PollOption, Vote]),
  ],
  providers: [PollsService, PollsGateway],
  controllers: [PollsController]
})
export class PollsModule {}
