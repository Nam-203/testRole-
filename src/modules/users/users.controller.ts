import { Controller, Get, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import fs from 'fs';
import path from 'path';

import { RequestWithUser } from '@/common/types/index.e';

import { GetUserResponseDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly configService: ConfigService) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the logged in user's details" })
  @ApiResponse({ status: 200, description: "Returns the logged in user's details", type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() { user }: RequestWithUser): Promise<GetUserResponseDto> {
    if (user.avatar && typeof user.avatar === 'string') {
      const avatarPath = path.join(process.cwd(), 'public', 'uploads', 'avatars', user.avatar);

      if (user.avatar && fs.existsSync(avatarPath)) {
        user.avatar = `${this.configService.get('BASE_URL')}/uploads/avatars/${user.avatar}`;
      } else {
        user.avatar = null;
      }
    }
    return plainToClass(GetUserResponseDto, user, { excludeExtraneousValues: true });
  }
}
