import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { RequestMetricsInterceptor } from './request-metrics.interceptor';

@Module({
  providers: [MetricsService],
  controllers: [MetricsController],
  exports: [
    MetricsService
  ],
})
export class MetricsModule {}
