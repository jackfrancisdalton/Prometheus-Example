import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from 'src/dtos/create-poll.dto';
import { Poll } from 'src/entities/poll.entity';
import { VoteDto } from 'src/dtos/vote.dto';
import { Vote } from 'src/entities/vote.entity';

@Controller('polls')
export class PollsController {

    constructor(
        private readonly pollsService: PollsService
    ) {}

    @Post()
    async createPoll(@Body() dto: CreatePollDto): Promise<Poll> {
        return this.pollsService.createPoll(dto);
    }

    @Get()
    async findAll(): Promise<Poll[]> {
        return this.pollsService.getAllPolls();
    }

    @Post(':pollId/vote')
    async vote(@Param('pollId', ParseIntPipe) pollId: number, @Body() dto: VoteDto): Promise<Vote> {
        return this.pollsService.vote(pollId, dto);
    }

    @Get(':pollId/results')
    async getResults(@Param('pollId') pollId: number): Promise<Vote[]> {
        return this.pollsService.getVotesForPoll(pollId);
    }

}
