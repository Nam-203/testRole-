// src/modules/permission/entities/permission.entity.ts

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Permission as PermissionEnum } from '../../../common/enums/Permission.enum';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: PermissionEnum
  })
  key: PermissionEnum;
}
