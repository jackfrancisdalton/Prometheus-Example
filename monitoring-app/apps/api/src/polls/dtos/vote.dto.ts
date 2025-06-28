import { IsString, IsInt } from 'class-validator';

export class VoteDto {
  @IsInt()
  optionId: number;

  @IsString()
  voterId: string;
}