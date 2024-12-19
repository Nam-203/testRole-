import { Column, Entity, OneToMany } from 'typeorm';

import { Role as RoleEnum } from '@/common/enums/role.enum';

import { AbstractEntityWithUUID } from '../../../common/abstracts/entity.abstract';

import { RolePermission } from './role_permissions.entity';

@Entity('roles')
export class Role extends AbstractEntityWithUUID {
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER
  })
  name: RoleEnum;

  @Column({ default: false })
  isSuperAdmin: boolean;
  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, { cascade: true })
  permissions: RolePermission[];
}
