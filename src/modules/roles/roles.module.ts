import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '../permission/entities/permission.entity';
import { UserRole } from '../users/entities/userRole.entity';

import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([Role, UserRole, Permission])],
  exports: [RolesService, TypeOrmModule.forFeature([Role])],
  providers: [RolesService]
})
export class RolesModule {}
