import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserDto } from './user.dto';

export class GetUserResponseDto extends OmitType(UserDto, ['password', 'userIds'] as const) {
  @Expose()
  id: string;

  constructor(partial: Partial<GetUserResponseDto>) {
    super();
    Object.assign(this, partial);
  }
}

export class UserResponseDto extends OmitType(UserDto, ['userIds'] as const) {}

export class UpdateUserBySelfResponseDto extends GetUserResponseDto {}

export class UpdateUserByAdminResponseDto extends GetUserResponseDto {
  @ApiProperty({
    example: 'User updated successfully',
    description: 'Message indicating the result of the update operation'
  })
  message: string;
}

export class GetTimeEntryUserResponseDto extends PartialType(PickType(GetUserResponseDto, ['fullName'])) {
  @Expose()
  id: string;
}
