import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Permission } from '../permission/entities/permission.entity';
import { PermissionModule } from '../permission/permission.module';
import { Role } from '../roles/entities/role.entity';
import { RolesModule } from '../roles/roles.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    forwardRef(() => AuthModule),
    forwardRef(() => RolesModule),
    forwardRef(() => PermissionModule)
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService],
  exports: [UsersService]
})
export class UsersModule {}
