import { Column, Entity } from 'typeorm';

import { AbstractEntityWithUUID } from '../../../common/abstracts/entity.abstract';

@Entity('roles')
export class Role extends AbstractEntityWithUUID {
  @Column({ default: 'User' })
  name: string;

  @Column({ default: false })
  isSuperAdmin: boolean;
}
