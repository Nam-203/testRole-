import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements IAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest<User>(err: any, user: User, info: any, context: ExecutionContext): User {
    // if (err || !user) {
    //   throw err || new Error('Unauthorized');
    // }
    // console.log('user', user);
    const request = context.switchToHttp().getRequest();
    request['user_data'] = user;

    console.log('request', request['user_data']);
    // console.log('request', request['user_data']);
    return user;
  }
}
