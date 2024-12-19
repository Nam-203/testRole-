import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEnum } from '@/common/enums/role.enum';
import { UsersService } from '@/modules/users/users.service';

import { Permission } from '../permission/entities/permission.entity';
import { User } from '../users/entities/user.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>
    // private readonly usersService: UsersService
  ) {}

  async createDefaultRole(): Promise<Role> {
    const newRole = this.rolesRepository.create({ name: RoleEnum.USER, isSuperAdmin: false });
    await this.rolesRepository.save(newRole);

    return newRole;
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
      relations: ['roles', 'roles.permissions']
    });
    return user?.roles.some((role) => role.name === RoleEnum.ADMIN) || false;
  }

  async updateRole(IdAdmin: string, userId: string, updateData: UpdateRoleDto): Promise<Role> {
    console.log('IdAdmin', IdAdmin);
    console.log('userId', userId);

    const isAdmin = await this.isAdmin(IdAdmin);
    console.log('isAdmin', isAdmin);
    if (!isAdmin) {
      throw new UnauthorizedException('Chỉ Admin mới được cập nhật vai trò');
    }

    const allowedRoles = [RoleEnum.EDITOR, RoleEnum.ADMIN];
    if (!allowedRoles.includes(updateData.name as RoleEnum)) {
      throw new BadRequestException('Vai trò mới không hợp lệ. Chỉ có thể là Editor hoặc Admin.');
    }

    // const user = await this.usersService.findOne({ where: { id: userId }, relations: ['roles'] });
    // if (!user) {
    //   throw new NotFoundException('Người dùng không tồn tại');
    // }

    // Tìm vai trò mới cần cập nhật
    const newRole = await this.rolesRepository.findOne({ where: { name: updateData.name as RoleEnum } });
    if (!newRole) {
      throw new NotFoundException('Vai trò không tồn tại');
    }

    // user.roles = [newRole]; // Ensure newRole is a valid Role object
    // await this.usersRepository.save(user);

    return; // Return the upda
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
