export interface PollOption {
    id: number;
    text: string;
    percentage: number;
}
  
export interface Poll {
    id: number;
    title: string;
    options: PollOption[];
    currentUserVoteOptionId?: number;
}