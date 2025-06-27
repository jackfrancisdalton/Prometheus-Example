import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePollDto } from 'src/dtos/create-poll.dto';
import { VoteDto } from 'src/dtos/vote.dto';
import { PollOption } from 'src/entities/poll-option.entity';
import { Poll } from 'src/entities/poll.entity';
import { Vote } from 'src/entities/vote.entity';
import { Repository } from 'typeorm';
import { PollsGateway } from './polls.gateway';
import { PollResponse } from 'src/dtos/poll-response.dto';

@Injectable()
export class PollsService {
    constructor(
        @InjectRepository(Poll) private readonly pollRepo: Repository<Poll>,
        @InjectRepository(PollOption) private readonly optionRepo: Repository<PollOption>,
        @InjectRepository(Vote) private readonly voteRepo: Repository<Vote>,
        private readonly gateway: PollsGateway,
    ) {}

    async createPoll(dto: CreatePollDto): Promise<Poll> {
        const poll = this.pollRepo.create({
            title: dto.title,
            options: dto.options.map(text => ({ text })),
        });
        const savedPoll = await this.pollRepo.save(poll);

        if(savedPoll) {
          this.gateway.broadcastPollCreate(savedPoll);
        }

        return savedPoll;
    }
    

    async getAllPolls(voterId: string): Promise<PollResponse[]> {
      const polls = await this.pollRepo.find({
        relations: ['options', 'votes', 'votes.option'],
      });
    
      return polls.map((poll) => {
        const totalVotes = poll.votes.length;
    
        const optionVotes = poll.options.map((option) => {
          const count = poll.votes.filter((v) => v.option.id === option.id).length;
          const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          return {
            id: option.id,
            text: option.text,
            percentage,
          };
        });
    
        const userVote = poll.votes.find((v) => v.voterId === voterId);
    
        return {
          id: poll.id,
          title: poll.title,
          options: optionVotes,
          currentUserVoteOptionId: userVote?.option.id,
        };
      });
    }

    async vote(pollId: number, dto: VoteDto): Promise<Vote> {
        // 1. Validate poll exists
        const poll = await this.pollRepo.findOne({
          where: { id: pollId },
          relations: ['options'],
        });
        if (!poll) {
          throw new NotFoundException('Poll not found');
        }
      
        // 2. Validate option exists and belongs to the poll
        const option = await this.optionRepo.findOne({
          where: { id: dto.optionId },
          relations: ['poll'],
        });
        if (!option || option.poll.id !== pollId) {
          throw new BadRequestException('Option does not belong to this poll');
        }
      
        // 3. Check if voter has already voted in this poll
        const existingVote = await this.voteRepo.findOne({
          where: {
            poll: { id: pollId },
            voterId: dto.voterId,
          },
          relations: ['poll'],
        });
        if (existingVote) {
          throw new BadRequestException('You have already voted in this poll');
        }
      
        // 4. Create and save vote
        const vote = this.voteRepo.create({
          poll,
          option,
          voterId: dto.voterId,
        });
        const savedVote = await this.voteRepo.save(vote);
      
        // 5. Fetch updated poll with options + vote count (if needed)
        const updatedPoll = await this.pollRepo.findOne({
          where: { id: pollId },
          relations: ['options', 'votes'],
        });
      
        if (updatedPoll) {
            this.gateway.broadcastPollUpdate(updatedPoll);
        }
      
        return savedVote;
      }
      

    async getVotesForPoll(pollId: number): Promise<Vote[]> {
        const poll = await this.pollRepo.findOne({
            where: { id: pollId },
            relations: ['votes', 'votes.option'],
        });

        if (!poll) throw new NotFoundException('Poll not found');
        return poll.votes;
    }
}
