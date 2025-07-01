import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMetricsInterceptor } from './metrics/request-metrics.interceptor';
import { MetricsService } from './metrics/metrics.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // allow Vite dev server
    credentials: true,
  });

  const metricsSerivce = app.get(MetricsService);

  app.useGlobalInterceptors(
    new RequestMetricsInterceptor(metricsSerivce)
  );
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
