import { SetMetadata } from '@nestjs/common';

import { Permission } from '../enums/Permission.enum';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions);
