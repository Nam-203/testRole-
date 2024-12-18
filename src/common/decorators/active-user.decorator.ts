import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from '@/modules/users/entities/user.entity';

/**
 * @description This decorator is used to get the active user data from the request object.
 */
export const ActiveUser = createParamDecorator((field: keyof User | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: User | undefined = request['user'];
  if (field) {
    return user?.[field];
  }

  return user;
});
