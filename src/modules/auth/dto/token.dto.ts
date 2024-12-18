import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'The access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'The refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class AccessTokenDto extends PickType(TokenDto, ['accessToken'] as const) {}

export class RefreshAccessTokenDto extends PickType(TokenDto, ['refreshToken'] as const) {}
