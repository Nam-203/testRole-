import { SetMetadata } from '@nestjs/common';

import { Permission } from '../enums/Permission.enum';
import { Role } from '../enums/role.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);
