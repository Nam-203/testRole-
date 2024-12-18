import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
  Param,
  Put,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly rolesRepository: Repository<Role>) {}

  async createNewRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, isSuperAdmin } = createRoleDto;

    const newRole = this.rolesRepository.create({
      name,
      isSuperAdmin
    });

    return this.rolesRepository.save(newRole);
  }

  async createDefaultRole(): Promise<void> {
    const defaultRole = await this.rolesRepository.findOne({ where: { name: 'User' } });
    if (!defaultRole) {
      const newRole = this.rolesRepository.create({ name: 'User', isSuperAdmin: false });
      await this.rolesRepository.save(newRole);
    }
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }
  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.rolesRepository.manager.findOne(User, {
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role']
    });

    return user?.userRoles.some((userRole) => userRole.role.name === 'ADMIN') || false;
  }

  async updateRole(updaterUserId: string, userId: string, updateData: UpdateRoleDto): Promise<Role> {
    const isAdmin = await this.isAdmin(updaterUserId);
    if (!isAdmin) {
      throw new UnauthorizedException('Chỉ Admin mới được cập nhật vai trò');
    }

    const userRole = await this.rolesRepository.findOne({
      where: { id: userId }, // Changed to use the correct property
      relations: ['role']
    });

    if (!userRole) {
      throw new NotFoundException('Vai trò không tồn tại cho người dùng');
    }

    const role = userRole; // Assuming userRole is of type Role

    if (role.name === 'ADMIN') {
      throw new BadRequestException('Không thể thay đổi vai trò Admin');
    }

    if (updateData.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: updateData.name }
      });

      if (existingRole && existingRole.id !== role.id) {
        throw new BadRequestException('Tên vai trò đã tồn tại');
      }

      if (['ADMIN', 'USER'].includes(updateData.name)) {
        throw new BadRequestException('Tên vai trò không hợp lệ');
      }
    }

    if (updateData.name) {
      role.name = updateData.name;
    }

    return this.rolesRepository.save(role);
  }
  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
