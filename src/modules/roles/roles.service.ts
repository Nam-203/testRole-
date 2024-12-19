import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role as RoleEnum } from '@/common/enums/role.enum';

import { User } from '../users/entities/user.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly rolesRepository: Repository<Role>) {}

  async createNewRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.rolesRepository.create({
      name: RoleEnum.USER,
      isSuperAdmin: createRoleDto.isSuperAdmin
    });

    return this.rolesRepository.save(newRole);
  }

  async createDefaultRole(): Promise<void> {
    const defaultRole = await this.rolesRepository.findOne({ where: { name: RoleEnum.USER } });
    if (!defaultRole) {
      const newRole = this.rolesRepository.create({ name: RoleEnum.USER, isSuperAdmin: false });
      await this.rolesRepository.save(newRole);
    }
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: string) {
    return this.rolesRepository.findOne({ where: { id: id } });
  }
  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.rolesRepository.manager.findOne(User, {
      where: { id: userId },
      relations: ['userRoles', 'userRoles.role']
    });
    return user?.userRoles.some((userRole) => userRole.role.name === RoleEnum.ADMIN) || false;
  }

  async updateRole(IdAdmin: string, roleId: string, updateData: UpdateRoleDto): Promise<Role> {
    console.log('IdAdmin', IdAdmin);
    console.log('roleId', roleId);

    const isAdmin = await this.isAdmin(IdAdmin);
    console.log('isAdmin', isAdmin);
    if (!isAdmin) {
      throw new UnauthorizedException('Chỉ Admin mới được cập nhật vai trò');
    }

    const allowedRoles = [RoleEnum.EDITOR, RoleEnum.ADMIN];
    if (!allowedRoles.includes(updateData.name as RoleEnum)) {
      throw new BadRequestException('Vai trò mới không hợp lệ. Chỉ có thể là Editor hoặc Admin.');
    }

    const newRole = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!newRole) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    newRole.name = updateData.name as RoleEnum; // Ensure you are updating the name correctly
    await this.rolesRepository.save(newRole);

    return newRole;
  }

  async remove(IdAdmin: string, id: string) {
    const isAdmin = await this.isAdmin(IdAdmin);
    if (!isAdmin) {
      throw new UnauthorizedException('Chỉ Admin mới được xóa vai trò');
    }
    const role = await this.rolesRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new NotFoundException('Vai trò không tồn tại');
    }
    if (role.name === RoleEnum.ADMIN) {
      throw new BadRequestException('Không thể xóa vai trò Admin');
    }
    return this.rolesRepository.delete(id);
  }
}
