import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ExceptionsFilter } from '@/common/filters/exception.filter';
import { CustomValidationPipe } from '@/common/pipes/custom-validation.pipe';
import { DatabaseModule } from '@/modules/database/database.module';

import { throttlerConfig } from './common/config/throttler.config';
import { ApiResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { JwtGuard } from './modules/auth/guards/jwt.guard';
import { PermissionModule } from './modules/permission/permission.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot(throttlerConfig),
    DatabaseModule,
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionModule
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter
    },
    JwtGuard,
    ApiResponseInterceptor
  ]
})
export class AppModule {}
