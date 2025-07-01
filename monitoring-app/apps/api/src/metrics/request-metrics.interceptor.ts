import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { MetricsService } from "./metrics.service";



export class RequestMetricsInterceptor implements NestInterceptor {
    constructor(
        private readonly metricsService: MetricsService,
    ) {} 


    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.route?.path || request.url;

        const endTracking = this.metricsService.httpRequestDurationHistogram.startTimer({
            method,
            url
        })

        return next.handle().pipe(
            tap(() => {
                this.metricsService.httpRequestsCounter.inc({ method, url})
                endTracking();
            })
        )
    }
}