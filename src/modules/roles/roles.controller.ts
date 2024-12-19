import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { Roles } from '@/common/decorators/custumsize';
import { RoleEnum } from '@/common/enums/role.enum';

import { RolesGuard } from '../auth/guards/role.guard';
import { UsersService } from '../users/users.service';

import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService
  ) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Patch('user/:userId')
  @ApiOperation({ summary: 'Cập nhật vai trò cho người dùng' })
  @ApiResponse({ status: 200, description: 'Cập nhật vai trò thành công', type: Role })
  async updateUserRole(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body() body: UpdateRoleDto
  ): Promise<Role> {
    const IdAdmin = req['user_data'].id;
    const user = await this.usersService.findUserById(userId, ['roles']);

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const newRole = await this.rolesService.updateRole(IdAdmin, userId, body);
    if (!newRole) {
      throw new NotFoundException('Vai trò không tồn tại');
    }

    user.roles = [newRole];
    return newRole;
  }

  // @Post()
  // @UseGuards(RolesGuard)
  // @Roles(RoleEnum.ADMIN)
  // @ApiOperation({ summary: 'Tạo vai trò mới' })
  // @ApiResponse({ status: 201, description: 'Vai trò mới được tạo thành công', type: Role })
  // async create(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
  //   return this.rolesService.createNewRole(createRoleDto);
  // }
  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.createNewRole(createRoleDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả vai trò' })
  @ApiResponse({ status: 200, description: 'Danh sách vai trò', type: [Role] })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy vai trò theo ID' })
  @ApiResponse({ status: 200, description: 'Vai trò tìm thấy', type: Role })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò' })
  @ApiResponse({ status: 200, description: 'Vai trò đã được xóa' })
  remove(@Param('id') id: string, @Req() req: Request) {
    const IdAdmin = req['user_data'].id;
    return this.rolesService.remove(IdAdmin, id);
  }
}
