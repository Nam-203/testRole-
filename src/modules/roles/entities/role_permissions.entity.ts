import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Permission } from '@/modules/permission/entities/permission.entity';

import { Role } from './role.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.id, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.id, { onDelete: 'CASCADE' })
  permission: Permission;
}
