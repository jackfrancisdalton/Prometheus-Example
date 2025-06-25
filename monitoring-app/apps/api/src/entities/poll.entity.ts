import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PollOption } from './poll-option.entity';
import { Vote } from './vote.entity';

@Entity()
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options: PollOption[];

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes: Vote[];
}
