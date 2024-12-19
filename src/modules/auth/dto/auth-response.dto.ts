import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserDto } from '@/modules/users/dto/user.dto';

import { AccessTokenDto, TokenDto } from './token.dto';

export class LoginResponseDto {
  @ApiProperty({ type: TokenDto })
  @ValidateNested()
  @Type(() => TokenDto)
  tokens: TokenDto;
}

export class RefreshAccessTokenResponseDto {
  @ApiProperty({ type: AccessTokenDto })
  tokens: AccessTokenDto;
}
