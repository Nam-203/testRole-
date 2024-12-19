import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Permission } from '../../../common/enums/Permission.enum';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();
    const requiredPermissions = this.reflector.get<Permission[]>('permissions', handler);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request['user_data'];
    console.log('userId', userId);

    for (const permission of requiredPermissions) {
      const hasPermission = await this.userService.hasPermission(userId, permission);
      if (!hasPermission) {
        throw new ForbiddenException(`You do not have the required permission: ${permission}`);
      }
    }

    return true;
  }
}
