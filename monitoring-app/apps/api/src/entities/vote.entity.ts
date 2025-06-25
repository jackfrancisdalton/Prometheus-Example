import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';

@Entity()
@Unique(['poll', 'voterId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Poll, (poll) => poll.votes, { eager: true })
  poll: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes, { eager: true })
  option: PollOption;

  @Column()
  voterId: string; // Can be user ID, email, IP, etc.
}