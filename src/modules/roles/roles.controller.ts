import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/custumsize';
import { Role as RoleEnum } from '@/common/enums/role.enum';

import { RolesGuard } from '../auth/guards/role.guard';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch(':roleId')
  @ApiOperation({ summary: 'Cập nhật vai trò' })
  @ApiResponse({ status: 200, description: 'Cập nhật vai trò thành công', type: Role })
  async updateRole(
    @Req() req,
    @Param('roleId') roleId: string,
    @Body()
    body: {
      name?: string;
    }
  ): Promise<Role> {
    const IdAdmin = req['user_data'].id;
    return this.rolesService.updateRole(IdAdmin, roleId, body);
  }
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createNewRole(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') @Req() req: Request, id: string) {
    const IdAdmin = req['user_data'].id;
    return this.rolesService.remove(IdAdmin, id);
  }
}
