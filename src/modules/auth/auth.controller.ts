import { Body, ConflictException, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { EUserStatus } from '@/common/enums/common.enum';
import { BcryptService } from '@/modules/auth/services/bcrypt.service';
import { TokenService } from '@/modules/auth/services/token.service';
import { UsersService } from '@/modules/users/users.service';

import { RegisterUserRequestDto } from '../users/dto/user-request.dto';

import { LoginRequestDto } from './dto/auth-request.dto';
import { LoginResponseDto } from './dto/auth-response.dto';
import { RefreshAccessTokenDto } from './dto/token.dto';
import { AuthService } from './services/auth.service';

@ApiTags('Authentications')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly bcryptService: BcryptService,
    private readonly tokenService: TokenService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid register fields' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() createUserRequestDto: RegisterUserRequestDto) {
    const { email, password } = createUserRequestDto;
    const existUser = await this.usersService.findUserByEmail(email);

    if (existUser) {
      throw new ConflictException('auth.errors.user_already_exists');
    }
    const hashedPassword = await this.bcryptService.hash(password);

    await this.usersService.createNewUser({
      ...createUserRequestDto,
      password: hashedPassword,
      status: EUserStatus.active
    });

    return {
      message: 'User created successfully'
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Invalid login fields' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() loginPayloadDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginPayloadDto;
    const user = await this.authService.validateUser(email, password);
    if (user.status === EUserStatus.inactive) {
      throw new UnauthorizedException('auth.errors.user_inactive');
    }

    if (user.status === EUserStatus.locked) {
      throw new UnauthorizedException('auth.errors.user_locked');
    }

    const { accessToken, refreshToken } = await this.authService.generateAuthTokens(user);

    return { tokens: { accessToken, refreshToken } };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke token' })
  @ApiResponse({ status: 200, description: 'Logout successfully' })
  @ApiResponse({ status: 400, description: 'Invalid token' })
  async logout(@Body() { refreshToken }: RefreshAccessTokenDto) {
    const refreshTokenPayload = await this.tokenService.verifyRefreshToken(refreshToken);
    await this.authService.revokeExistingTokens(refreshTokenPayload.userId);
    return { message: 'Logout successfully' };
  }
}
