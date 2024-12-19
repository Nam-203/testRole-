import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/custumsize';
import { RoleEnum } from '@/common/enums/role.enum';

import { RolesGuard } from '../auth/guards/role.guard';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { PermissionService } from './permission.service';

@ApiTags('Permissions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Roles(RoleEnum.ADMIN)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get()
  @Roles(RoleEnum.ADMIN)
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @Roles(RoleEnum.ADMIN)
  findOne(@Param('id') id: string) {
    return this.permissionService.findOne(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.ADMIN)
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdateUserPermissionsDto) {
    return this.permissionService.updateUserPermissions(updatePermissionDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
