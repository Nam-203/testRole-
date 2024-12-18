import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
