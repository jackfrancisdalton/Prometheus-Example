import { IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(2)
  options: string[];
}