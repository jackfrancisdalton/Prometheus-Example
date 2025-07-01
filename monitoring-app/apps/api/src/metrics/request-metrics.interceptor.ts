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
        const route = request.route?.path || request.url;
        const status = request.res?.statusCode || 500; // Default to 500 if status code is not available

        const endTracking = this.metricsService.httpRequestDurationHistogram.startTimer({
            method,
            route,
            status
        })

        return next.handle().pipe(
            tap(() => {
                this.metricsService.httpRequestsCounter.inc({ method, route})
                endTracking();
            })
        )
    }
}