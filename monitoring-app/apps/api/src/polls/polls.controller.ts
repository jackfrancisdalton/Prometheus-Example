import {
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
  import { CreatePollDto } from 'src/polls/dtos/create-poll.dto';
  import { VoteDto } from 'src/polls/dtos/vote.dto';
import { PollsMapper } from 'src/polls/utils/polls-mapper';
  
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  async createPoll(@Body() dto: CreatePollDto) {
    const poll = await this.pollsService.createPoll(dto);
    return PollsMapper.toPollResponse(poll);
  }

  @Get()
  async findAll(@Query('voterId') voterId?: string) {
    const polls = await this.pollsService.getAllPolls();
    return polls.map(poll => PollsMapper.toPollResponse(poll, voterId));
  }

  @Post(':pollId/vote')
  async vote(
    @Param('pollId', ParseIntPipe) pollId: number,
    @Body() dto: VoteDto,
  ) {
    const updatedPoll = await this.pollsService.vote(pollId, dto);
    return PollsMapper.toPollResponse(updatedPoll, dto.voterId);
  }

  @Delete(':pollId')
  async deletePoll(@Param('pollId', ParseIntPipe) pollId: number) {
    await this.pollsService.deletePoll(pollId);
  }
}
  