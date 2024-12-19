import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '@/common/types/index.e';
import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { TokenService } from '../services/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: TokenPayload): Promise<User> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const currentTime = Date.now() / 1000;
    if (payload.exp < currentTime) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const isExistAccessToken = await this.tokenService.isExistAccessToken(token);

    if (!isExistAccessToken) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const isTokenRevoked = await this.tokenService.isAccessTokenRevoked(token);

    if (isTokenRevoked) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const isValidAccessToken = await this.tokenService.verifyAccessToken(token);
    console.log('isValidAccessToken', isValidAccessToken);

    if (!isValidAccessToken) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const user = await this.usersService.findUserById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }
    return user;
  }
}
