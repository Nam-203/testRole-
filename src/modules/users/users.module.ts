import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { RolePermission } from '../roles/entities/role_permissions.entity';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, RolePermission, RolesService],
  exports: [UsersService]
})
export class UsersModule {}
