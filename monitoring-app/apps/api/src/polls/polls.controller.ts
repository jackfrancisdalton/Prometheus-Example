import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
  } from '@nestjs/common';
  import { PollsService } from './polls.service';
  import { CreatePollDto } from 'src/dtos/create-poll.dto';
  import { VoteDto } from 'src/dtos/vote.dto';
  import { Vote } from 'src/entities/vote.entity';
  import { PollResponse } from 'src/dtos/poll-response.dto';
  import { PollsGateway } from './polls.gateway';
  import { Poll } from 'src/entities/poll.entity';
import { PollsMapper } from 'src/utils/polls-mapper';
  
  @Controller('polls')
  export class PollsController {
    constructor(
      private readonly pollsService: PollsService,
      private readonly gateway: PollsGateway,
    ) {}
  
    @Post()
    async createPoll(@Body() dto: CreatePollDto): Promise<PollResponse> {
      const poll = await this.pollsService.createPoll(dto);

      const response: PollResponse = PollsMapper.toPollResponse(poll);  
      this.gateway.broadcastPollCreate(response);
      return response;
    }
  
    @Get()
    async findAll(@Query('voterId') voterId: string): Promise<PollResponse[]> {
      if (!voterId) {
        throw new BadRequestException('voterId is required');
      }
  
      const polls = await this.pollsService.getAllPolls();
      return polls.map(poll => PollsMapper.toPollResponse(poll, voterId));
    }
  
    @Post(':pollId/vote')
    async vote(
      @Param('pollId', ParseIntPipe) pollId: number,
      @Body() dto: VoteDto,
    ): Promise<PollResponse> {
      const updatedPoll = await this.pollsService.vote(pollId, dto);
  
      const response = PollsMapper.toPollResponse(updatedPoll, dto.voterId);  
      this.gateway.broadcastPollUpdate(response);
      return response;
    }
  
    @Delete(':pollId')
    async deletePoll(
      @Param('pollId', ParseIntPipe) pollId: number,
    ): Promise<void> {
      await this.pollsService.deletePoll(pollId);
      this.gateway.broadcastPollDelete(pollId);
    }
  }
  