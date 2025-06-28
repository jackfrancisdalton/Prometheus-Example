import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique, JoinColumn, CreateDateColumn } from 'typeorm';
import { Poll } from './poll.entity';
import { PollOption } from './poll-option.entity';

@Entity()
@Unique(['poll', 'voterId'])
export class Vote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Poll, (poll) => poll.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pollId' })
  poll: Poll;

  @ManyToOne(() => PollOption, (option) => option.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'optionId' })
  option: PollOption;

  @Column()
  voterId: string;

  @CreateDateColumn()
  createdAt: Date;
}