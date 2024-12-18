import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';

import { AbstractEntityWithUUID } from '@/common/abstracts/entity.abstract';
import { User } from '@/modules/users/entities/user.entity';

import { AccessToken } from './access-token.entity';

@Entity('refresh_tokens')
@Unique(['value'])
export class RefreshToken extends AbstractEntityWithUUID {
  @Column()
  value!: string;

  @Column({ default: false })
  revoked!: boolean;

  @OneToMany(() => AccessToken, (accessToken) => accessToken.refreshToken, {
    cascade: true
  })
  accessTokens!: AccessToken[];

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'expired_at' })
  expiredAt!: Date;
}
