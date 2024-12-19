import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { RoleEnum } from '@/common/enums/role.enum';
import { Permission } from '@/modules/permission/entities/permission.entity';

import { RolePermissions } from '../roles/role-permission';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission) // Đảm bảo inject đúng repository
    private readonly permissionsRepository: Repository<Permission>
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

    // Lấy các permission từ database tương ứng với các key trong permissionKeys
    const permissions = await this.permissionsRepository.find({
      where: {
        key: In(permissionKeys) // Sử dụng `In` để tìm tất cả quyền có trong permissionKeys
      }
    });

    return permissions;
  }
  async getPermissionByKey(permissionKey: PermissionEnum): Promise<Permission | null> {
    return await this.permissionsRepository.findOne({
      where: { key: permissionKey } // Sử dụng PermissionEnum ở đây
    });
  }

  // Tạo mới quyền
  async createPermission(permissionKey: PermissionEnum): Promise<Permission> {
    const permission = this.permissionsRepository.create({ key: permissionKey });
    return await this.permissionsRepository.save(permission); // Lưu vào DB
  }
  findAll() {
    return `This action returns all permission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
