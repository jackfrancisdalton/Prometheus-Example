import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetricsModule } from './metrics/metrics.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [MetricsModule, PollsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
