import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, ValidateIf } from 'class-validator';

import { UserDto } from './user.dto';

export class UpdateUserBySelfRequestDto extends PartialType(
  PickType(UserDto, ['fullName', 'phone', 'gender', 'address'] as const)
) {
  @ValidateIf(
    (dto: UpdateUserBySelfRequestDto) =>
      !Object.values(dto).some((value) => value !== null && value !== undefined && value !== '')
  )
  @IsNotEmpty({ message: 'At least one field must be provided' })
  validateAtLeastOneField: boolean;
}

export class UpdateUserByAdminRequestDto extends PickType(UserDto, [
  'email',
  'fullName',
  'phone',
  'gender',
  'address'
] as const) {
  @ValidateIf(
    (dto: UpdateUserBySelfRequestDto) =>
      !Object.values(dto).some((value) => value !== null && value !== undefined && value !== '')
  )
  @IsNotEmpty({ message: 'At least one field must be provided' })
  validateAtLeastOneField: boolean;
}

export class RegisterUserRequestDto extends OmitType(UserDto, ['userIds'] as const) {}

export class AssignRoleRequestDto extends PickType(UserDto, ['userIds'] as const) {}

export class ExportUsersDto {
  @ApiProperty({ description: 'Array of user IDs', type: [String] })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
