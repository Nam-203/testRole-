import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';

import { EGender, EUserStatus } from '@/common/enums/common.enum';

export class UserDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  @Expose()
  readonly email: string;

  @ApiProperty({ example: 'Pass@123', description: 'Password of user' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password to weak' })
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of user' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  @Expose()
  readonly fullName: string;

  @ApiProperty({ example: '0123456789', description: 'Phone of user' })
  @IsPhoneNumber('VN')
  @Expose()
  readonly phone: string;

  @ApiProperty({ example: '123 Hoang Dieu', description: 'Address of user' })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  @Expose()
  readonly address: string;

  @ApiProperty({ example: 1, description: 'Gender of user' })
  @IsEnum(EGender)
  @IsNotEmpty()
  @Expose()
  readonly gender: EGender;

  @ApiProperty({ example: 1, description: 'Status of user' })
  @IsEnum(EUserStatus)
  @IsNotEmpty()
  @Expose()
  readonly status: EUserStatus;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Avatar of user'
  })
  @IsOptional()
  @Expose()
  readonly avatar?: any;

  @ApiProperty({
    example: ['2457d5fd-2466-4a05-b993-8130aadba617', '2457d5fd-2466-4a05-b993-8130aadba617'],
    description: 'Array of user IDs'
  })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];

  constructor(user: Partial<UserDto>) {
    Object.assign(this, user);
  }
}
