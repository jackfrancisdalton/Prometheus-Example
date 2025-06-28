import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './metrics/metrics.module';
import { PollsModule } from './polls/polls.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { Vote } from './entities/vote.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'appdb',
      entities: [Poll, PollOption, Vote],
      dropSchema: true, // NOTE: instead of dealing with migrations we drop and sync the entiies each time
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Poll, PollOption]),
    MetricsModule, 
    PollsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
