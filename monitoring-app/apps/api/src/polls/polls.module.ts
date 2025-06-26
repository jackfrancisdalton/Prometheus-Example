import { Module } from '@nestjs/common';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from 'src/entities/poll.entity';
import { PollOption } from 'src/entities/poll-option.entity';
import { Vote } from 'src/entities/vote.entity';
import { PollsGateway } from './polls.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, PollOption, Vote]),
  ],
  providers: [PollsService, PollsGateway],
  controllers: [PollsController]
})
export class PollsModule {}
