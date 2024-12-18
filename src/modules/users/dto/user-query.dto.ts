import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

import { EGender, EUserStatus } from '@/common/enums/common.enum';

export class UserQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly fullName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber('VN')
  readonly phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiPropertyOptional({ enum: EGender })
  @IsOptional()
  @IsEnum(EGender)
  @Transform(({ value }) => (value !== undefined ? parseInt(value, 10) : undefined))
  readonly gender?: EGender;
}
