import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '../permission/entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Permission]), forwardRef(() => UsersModule)],
  controllers: [RolesController],
  providers: [RolesService, ConfigService],
  exports: [RolesService]
})
export class RolesModule {}
