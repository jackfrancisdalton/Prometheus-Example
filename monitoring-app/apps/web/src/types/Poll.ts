export interface PollOption {
    id: number;
    text: string;
    votes: number;
}
  
export interface Poll {
    id: number;
    title: string;
    options: PollOption[];
}