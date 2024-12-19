import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PERMISSIONS_KEY } from '@/common/decorators/custumsize';

import { UsersService } from '../../users/users.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findUserLogin(request.body.email);
    const routePermissions = this.reflector.getAllAndOverride(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!routePermissions || !routePermissions.length) {
      return true;
    }

    const allPermissions = routePermissions;
    if (user && user.roles.length > 0) {
      const permissions = user.roles.flatMap((role) => role.permissions.map((permission) => permission.key));
      const arePermissionsMatching = allPermissions.every((action) => permissions.includes(action));
      return arePermissionsMatching;
    }
    return false;
  }
}
