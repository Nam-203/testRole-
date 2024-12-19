// src/modules/roles/role-permissions.ts

import { Permission } from '@/common/enums/Permission.enum';
import { RoleEnum } from '@/common/enums/role.enum';

export const RolePermissions = {
  [RoleEnum.USER]: [Permission.READ],
  [RoleEnum.EDITOR]: [Permission.READ, Permission.UPDATE],
  [RoleEnum.ADMIN]: [Permission.READ, Permission.CREATE, Permission.UPDATE, Permission.DELETE]
};
