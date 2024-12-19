import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { Permission } from '@/common/enums/Permission.enum';

export class CreatePermissionDto {
  @ApiProperty({
    enum: Permission,
    description: 'Permission key'
  })
  @IsNotEmpty()
  @IsEnum(Permission)
  key: Permission;
}
