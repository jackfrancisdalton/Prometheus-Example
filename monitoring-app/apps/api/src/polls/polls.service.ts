import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePollDto } from 'src/dtos/create-poll.dto';
import { VoteDto } from 'src/dtos/vote.dto';
import { PollOption } from 'src/entities/poll-option.entity';
import { Poll } from 'src/entities/poll.entity';
import { Vote } from 'src/entities/vote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PollsService {
    constructor(
        @InjectRepository(Poll) private readonly pollRepo: Repository<Poll>,
        @InjectRepository(PollOption) private readonly optionRepo: Repository<PollOption>,
        @InjectRepository(Vote) private readonly voteRepo: Repository<Vote>,
    ) {}

    async createPoll(dto: CreatePollDto): Promise<Poll> {
        const poll = this.pollRepo.create({
            title: dto.title,
            options: dto.options.map(text => ({ text })),
        });
        return this.pollRepo.save(poll);
    }

    async getAllPolls(): Promise<Poll[]> {
        return this.pollRepo.find({ relations: ['options', 'votes'] });
    }

    async vote(pollId: number, dto: VoteDto): Promise<Vote> {
        const option = await this.optionRepo.findOne({
            where: { id: dto.optionId },
            relations: ['poll'],
        });

        if (!option || option.poll.id !== pollId) {
            throw new BadRequestException('Option does not belong to this poll');
        }

        const existingVote = await this.voteRepo.findOne({
            where: {
                poll: { id: pollId },
                voterId: dto.voterId,
            },
        });

        if (existingVote) {
            throw new BadRequestException('You already voted on this poll');
        }

        const vote = this.voteRepo.create({
            poll: option.poll,
            option,
            voterId: dto.voterId,
        });

        return this.voteRepo.save(vote);
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
