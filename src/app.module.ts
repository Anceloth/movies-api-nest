import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './presentation/controllers/app.controller';
import { UserModule } from './infrastructure/modules/user.module';
import { MovieModule } from './infrastructure/modules/movie.module';
import { RoomModule } from './infrastructure/modules/room.module';
import databaseConfig from './infrastructure/config/database.config';
import appConfig from './infrastructure/config/app.config';
import jwtConfig from './infrastructure/config/jwt.config';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { DomainExceptionFilter } from './shared/filters/domain-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('app.throttle.ttl'),
          limit: configService.get('app.throttle.limit'),
        },
      ],
      inject: [ConfigService],
    }),
    UserModule,
    MovieModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
