// polls.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Poll } from 'src/polls/entities/poll.entity';
import { PollOption } from 'src/polls/entities/poll-option.entity';
import { Vote } from 'src/polls/entities/vote.entity';
import { CreatePollDto } from 'src/polls/dtos/create-poll.dto';
import { VoteDto } from 'src/polls/dtos/vote.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollOption) private readonly optionRepo: Repository<PollOption>,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly metricsService: MetricsService
  ) {}

  async createPoll(dto: CreatePollDto): Promise<Poll> {
    const poll = this.pollRepo.create({
      title: dto.title,
      options: dto.options.map(text => this.optionRepo.create({ text })),
    });
    const savedPoll = await this.pollRepo.save(poll);

    // Track a poll was created
    this.metricsService.pollsCreatedCounter.inc();

    // update websocket
    this.eventEmitter.emit('poll.created', savedPoll);
    return savedPoll;
  }

  async getAllPolls(): Promise<Poll[]> {
    return this.pollRepo.find({
      relations: ['options', 'votes', 'votes.option'],
    });
  }

  async vote(pollId: number, dto: VoteDto): Promise<Poll> {
    return await this.dataSource.transaction(async manager => {
      const optionRepo = manager.getRepository(PollOption);
      const voteRepo = manager.getRepository(Vote);
      const pollRepo = manager.getRepository(Poll);

      const option = await optionRepo.findOne({
        where: { id: dto.optionId },
        relations: ['poll'],
      });

      if (!option || option.poll.id !== pollId) {
        throw new BadRequestException('Option does not belong to this poll');
      }

      const existingVote = await voteRepo.findOne({
        where: { poll: { id: pollId }, voterId: dto.voterId },
      });

      if (existingVote) {
        throw new BadRequestException('You have already voted in this poll');
      }

      await voteRepo.save(
        voteRepo.create({
          poll: option.poll,
          option,
          voterId: dto.voterId,
        }),
      );

      // update vote count
      this.metricsService.pollVotesCounter.inc();

      const poll = await pollRepo.findOne({
        where: { id: pollId },
        relations: ['options', 'votes', 'votes.option'],
      });

      if (!poll) {
        throw new NotFoundException('Poll not found');
      }

      this.eventEmitter.emit('poll.voted', poll);

      return poll;
    });
  }

  async deletePoll(pollId: number): Promise<void> {
    await this.pollRepo.delete(pollId);

    // update delete count
    this.metricsService.pollsDeletedCounter.inc();

    this.eventEmitter.emit('poll.deleted', { pollId });
  }
}
