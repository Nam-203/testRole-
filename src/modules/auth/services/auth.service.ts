import { Injectable, UnauthorizedException } from '@nestjs/common';

import { User } from '@/modules/users/entities/user.entity';
import { UsersService } from '@/modules/users/users.service';

import { RefreshAccessTokenResponseDto } from '../dto/auth-response.dto';

import { BcryptService } from './bcrypt.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Xác thực thông tin người dùng
   * @param lang Ngôn ngữ
   * @param email Email người dùng
   * @param password Mật khẩu
   */
  async validateUser(email: string, password: string): Promise<User> {
    return this.validateUserCredentials(email, password);
  }

  /**
   * Làm mới access token
   * @param lang Ngôn ngữ
   * @param refreshTokenValue Giá trị refresh token
   */
  async refreshAccessToken(refreshTokenValue: string): Promise<RefreshAccessTokenResponseDto> {
    const refreshTokenPayload = await this.tokenService.verifyRefreshToken(refreshTokenValue);
    const refreshToken = await this.tokenService.findRefreshTokenByValue(refreshTokenValue);

    if (!refreshToken) {
      throw new UnauthorizedException('auth.errors.invalid_token');
    }

    const user = await this.usersService.findUserById(refreshTokenPayload.userId);
    await this.tokenService.revokeAccessTokensByRefreshToken(refreshToken);
    const newAccessToken = await this.tokenService.generateAccessToken(user, refreshToken);

    return { tokens: { accessToken: newAccessToken.value } };
  }

  /**
   * Xác thực thông tin đăng nhập của người dùng
   * @param lang Ngôn ngữ
   * @param email Email người dùng
   * @param password Mật khẩu người dùng
   * @returns Thông tin người dùng nếu xác thực thành công
   * @throws UnauthorizedException nếu thông tin đăng nhập không hợp lệ
   */
  async validateUserCredentials(email: string, password: string): Promise<User> {
    const user = await this.usersService.findUserLogin(email);

    if (!user || !(await this.bcryptService.compare(password, user.password))) {
      throw new UnauthorizedException('auth.errors.invalid_email_or_password');
    }

    return user;
  }

  /**
   * Thu hồi tất cả token hiện có của người dùng
   * @param userId ID người dùng
   */
  async revokeExistingTokens(userId: string): Promise<void> {
    return await this.tokenService.revokeTokensByUserId(userId);
  }

  /**
   * Tạo mới access token và refresh token cho người dùng
   * @param user Thông tin người dùng
   * @returns Object chứa access token và refresh token mới
   */
  async generateAuthTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = await this.tokenService.generateRefreshToken(user);
    const accessToken = await this.tokenService.generateAccessToken(user, refreshToken);

    return { accessToken: accessToken.value, refreshToken: refreshToken.value };
  }
}
