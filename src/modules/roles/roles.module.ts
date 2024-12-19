import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Permission } from '../permission/entities/permission.entity';
import { UserRole } from '../users/entities/userRole.entity';
import { UsersModule } from '../users/users.module';

import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
// import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, UserRole, Permission]), forwardRef(() => UsersModule)],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService]
})
export class RolesModule {}
