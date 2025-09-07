import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const now = Date.now();
    
    return next.handle().pipe(
      map(data => ({
        data,
        message: 'Success',
        statusCode: context.switchToHttp().getResponse().statusCode,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
