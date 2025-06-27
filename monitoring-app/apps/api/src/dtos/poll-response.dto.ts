export class PollOptionResponse {
    id: number;
    text: string;
    percentage: number;
  }
  
  export class PollResponse {
    id: number;
    title: string;
    options: PollOptionResponse[];
    currentUserVoteOptionId?: number;
  }