import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { RoleEnum } from '@/common/enums/role.enum';
import { Permission } from '@/modules/permission/entities/permission.entity';

import { Role } from '../roles/entities/role.entity';
import { RolePermissions } from '../roles/role-permission';
import { User } from '../users/entities/user.entity';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionsRepository.create(createPermissionDto);
    return await this.permissionsRepository.save(permission);
  }

  async getPermissionsForRole(role: RoleEnum): Promise<Permission[]> {
    const permissionKeys = RolePermissions[role];

    if (!permissionKeys) {
      throw new Error('Role does not have any permissions defined.');
    }

    const permissions = await this.permissionsRepository.find({
      where: {
        key: In(permissionKeys)
      }
    });

    return permissions;
  }

  async getPermissionByKey(permissionKey: PermissionEnum): Promise<Permission | null> {
    return await this.permissionsRepository.findOne({
      where: { key: permissionKey }
    });
  }

  async createPermission(permissionKey: PermissionEnum): Promise<Permission> {
    const permission = this.permissionsRepository.create({ key: permissionKey });
    return await this.permissionsRepository.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return await this.permissionsRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    return await this.permissionsRepository.findOne({ where: { id } });
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    await this.permissionsRepository.update(id, updatePermissionDto);
    return await this.findOne(id);
  }

  async updateUserPermissions(dto: UpdateUserPermissionsDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user has admin role with isSuperAdmin
    const hasAdminAccess = user.roles.some((role) => role.name === RoleEnum.ADMIN && role.isSuperAdmin);

    if (!hasAdminAccess) {
      throw new ForbiddenException('User does not have super admin privileges');
    }

    // Get or create permissions
    const permissions = await Promise.all(
      dto.permissions.map(async (permKey) => {
        let permission = await this.getPermissionByKey(permKey);
        if (!permission) {
          permission = await this.createPermission(permKey);
        }
        return permission;
      })
    );

    // Update user's role permissions
    const adminRole = user.roles.find((role) => role.name === RoleEnum.ADMIN);
    if (adminRole) {
      adminRole.permissions = permissions;
      await this.roleRepository.save(adminRole);
    }
  }

  async remove(id: string): Promise<void> {
    await this.permissionsRepository.delete(id);
  }
}
