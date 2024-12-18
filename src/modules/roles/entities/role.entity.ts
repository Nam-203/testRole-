import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntityWithUUID } from '../../../common/abstracts/entity.abstract';

import { RolePermission } from './role_permissions.entity';

@Entity('roles')
export class Role extends AbstractEntityWithUUID {
  @Column({ default: 'User' })
  name: string;

  @Column({ default: false })
  isSuperAdmin: boolean;
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, { cascade: true })
  permissions: RolePermission[];
}
