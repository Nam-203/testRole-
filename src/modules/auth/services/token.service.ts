import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import ms from 'ms';
import { Repository } from 'typeorm';

import { DatabaseError } from '@/common/classes/database-error.class';
import { EJwtConfigKey, ETokenType } from '@/common/enums/auth.enum';
import { TokenPayload } from '@/common/types/index.e';
import { User } from '@/modules/users/entities/user.entity';

import { AccessToken } from '../entities/access-token.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(AccessToken) private readonly accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(RefreshToken) private readonly refreshTokenRepository: Repository<RefreshToken>
  ) {}

  decodeToken(token: string): TokenPayload {
    const decodedToken = this.jwtService.decode(token) as TokenPayload;

    if (!decodedToken || typeof decodedToken !== 'object' || !('tokenType' in decodedToken)) {
      throw new BadRequestException('Invalid token');
    }

    return decodedToken;
  }

  async generateAccessToken(user: User, refreshToken: RefreshToken): Promise<AccessToken> {
    const payload = { userId: user.id, tokenType: ETokenType.ACCESS };
    let token: string;
    let isUnique = false;
    let accessToken: AccessToken;

    while (!isUnique) {
      token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(EJwtConfigKey.JWT_ACCESS_TOKEN_SECRET),
        expiresIn: this.configService.get<string>(EJwtConfigKey.JWT_ACCESS_TOKEN_EXPIRATION_TIME)
      });

      const expiresAt = new Date(
        Date.now() + ms(this.configService.get<string>(EJwtConfigKey.JWT_ACCESS_TOKEN_EXPIRATION_TIME))
      );

      accessToken = this.accessTokenRepository.create({
        refreshToken,
        value: token,
        expiredAt: expiresAt
      });

      try {
        await this.accessTokenRepository.save(accessToken);
        isUnique = true;
      } catch (error) {
        if (DatabaseError.isUniqueConstraintViolation(error)) {
          continue;
        } else {
          throw error;
        }
      }
    }

    return accessToken;
  }

  async generateRefreshToken(user: User): Promise<RefreshToken> {
    const payload = { userId: user.id, tokenType: ETokenType.REFRESH };
    let token: string;
    let isUnique = false;
    let refreshToken: RefreshToken;

    while (!isUnique) {
      token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(EJwtConfigKey.JWT_REFRESH_TOKEN_SECRET),
        expiresIn: this.configService.get<string>(EJwtConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME)
      });
      const expiresAt = new Date(
        Date.now() + ms(this.configService.get<string>(EJwtConfigKey.JWT_REFRESH_TOKEN_EXPIRATION_TIME))
      );

      refreshToken = this.refreshTokenRepository.create({ user, value: token, expiredAt: expiresAt });

      try {
        await this.refreshTokenRepository.save(refreshToken);
        isUnique = true;
      } catch (error) {
        if (DatabaseError.isUniqueConstraintViolation(error)) {
          continue;
        } else {
          throw error;
        }
      }
    }

    return refreshToken;
  }

  async isRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({ where: { value: token } });
    return !!refreshToken;
  }

  async revokeAccessToken(accessTokenId: string): Promise<void> {
    await this.accessTokenRepository.update(accessTokenId, { revoked: true });
  }

  async revokeRefreshToken(refreshTokenId: string): Promise<void> {
    await this.refreshTokenRepository.update(refreshTokenId, { revoked: true });
  }

  async isExistAccessToken(token: string): Promise<boolean> {
    const accessToken = await this.accessTokenRepository.findOne({ where: { value: token } });
    return !!accessToken;
  }

  async isAccessTokenRevoked(token: string): Promise<boolean> {
    const accessToken = await this.accessTokenRepository.findOne({ where: { value: token, revoked: true } });
    return !!accessToken;
  }

  async isRefreshTokenRevoked(token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({ where: { value: token, revoked: true } });
    return !!refreshToken;
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    if (!token) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const isRevoked = await this.isAccessTokenRevoked(token);
    if (isRevoked) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(EJwtConfigKey.JWT_ACCESS_TOKEN_SECRET)
    });
  }

  revokeAccessTokensByRefreshToken = async (refreshToken: RefreshToken) => {
    await this.accessTokenRepository.update({ refreshToken }, { revoked: true });
  };

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    if (!token) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const refreshToken = await this.refreshTokenRepository.findOne({ where: { value: token } });

    if (!refreshToken) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    const isRevoked = await this.isRefreshTokenRevoked(token);

    if (isRevoked) {
      throw new UnauthorizedException('auth.errors.unauthorized');
    }

    return await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(EJwtConfigKey.JWT_REFRESH_TOKEN_SECRET)
    });
  }

  async revokeTokensByUserId(userId: string): Promise<void> {
    const refreshTokens = await this.refreshTokenRepository.find({
      where: { user: { id: userId }, revoked: false },
      relations: ['accessTokens']
    });

    for (const refreshToken of refreshTokens) {
      for (const accessToken of refreshToken.accessTokens) {
        if (!accessToken.revoked) {
          await this.revokeAccessToken(accessToken.id);
        }
      }

      await this.revokeRefreshToken(refreshToken.id);
    }
  }

  async findRefreshTokenByValue(value: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne({ where: { value } });
  }
}
