import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'Pass@123', description: 'Password of user' })
  @IsNotEmpty()
  readonly password: string;
}

export class ForgotPasswordRequestDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResendVerifyEmailRequestDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email of user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ChangePasswordRequestDto {
  @ApiProperty({ example: 'Pass@123', description: 'Password of user' })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'Pass@123', description: 'Password of user' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password to weak' })
  @IsNotEmpty()
  newPassword: string;
}

export class ResetPasswordRequestDto {
  @ApiProperty({ example: 'Pass@123', description: 'Password of user' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password to weak' })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token' })
  @IsNotEmpty()
  token: string;
}

export class VerifyAccountRequestDto {
  @ApiProperty({ example: 'Pass@123', description: 'Password of user' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password to weak' })
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token' })
  @IsNotEmpty()
  token: string;
}
