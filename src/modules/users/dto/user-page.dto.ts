import { ApiProperty } from '@nestjs/swagger';

import { PageDto } from '@/common/dto/page.dto';

import { User } from '../entities/user.entity';

export class UserPageDto extends PageDto<User> {
  @ApiProperty({ type: [User] })
  declare items: User[];
}
