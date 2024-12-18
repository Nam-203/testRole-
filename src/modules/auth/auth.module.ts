import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { jwtConfig } from '@/common/config/jwt.config';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';

import { UsersModule } from '../users/users.module';

import { AccessToken } from './entities/access-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { AuthService } from './services/auth.service';
import { BcryptService } from './services/bcrypt.service';
import { TokenService } from './services/token.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([AccessToken, RefreshToken]),
    JwtModule.register({}),
    forwardRef(() => UsersModule)
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TokenService, BcryptService, ConfigService],
  exports: [AuthService]
})
export class AuthModule {}
