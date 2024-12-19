import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { RoleEnum } from '@/common/enums/role.enum';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { User } from '@/modules/users/entities/user.entity';

import { AbstractEntityWithUUID } from '../../../common/abstracts/entity.abstract';

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

  @ManyToMany(() => Permission, (permission) => permission, {
    cascade: true
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' }
  })
  permissions: Permission[];
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
