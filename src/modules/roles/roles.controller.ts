import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Put(':roleId')
  @ApiOperation({ summary: 'Cập nhật vai trò' })
  @ApiResponse({ status: 200, description: 'Cập nhật vai trò thành công', type: Role })
  async updateRole(
    @Req() req,
    @Param('roleId') roleId: string,
    @Body()
    body: {
      name?: string;
      description?: string;
    }
  ): Promise<Role> {
    return this.rolesService.updateRole(req.user.id, roleId, body);
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
    return this.rolesService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
