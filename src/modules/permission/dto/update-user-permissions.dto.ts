import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';

export class UpdateUserPermissionsDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty({ type: [String], enum: PermissionEnum })
  @IsArray()
  permissions: PermissionEnum[];
}
