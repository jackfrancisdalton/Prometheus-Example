import { PollResponse } from "src/dtos/poll-response.dto";
import { Poll } from "src/entities/poll.entity";

export class PollsMapper {
    static toPollResponse(poll: Poll, voterId?: string): PollResponse {
      const totalVotes = poll.votes?.length || 0;
      const optionVotes = poll.options.map(option => {
        const count = poll.votes?.filter(v => v.option.id === option.id).length || 0;
        const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
        return {
          id: option.id,
          text: option.text,
          percentage,
        };
      });
  
      const userVote = voterId
        ? poll.votes?.find(v => v.voterId === voterId)
        : undefined;
  
      return {
        id: poll.id,
        title: poll.title,
        options: optionVotes,
        currentUserVoteOptionId: userVote?.option.id,
      };
    }
  }