import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AbstractEntityWithUUID } from '@/common/abstracts/entity.abstract';

import { RefreshToken } from './refresh-token.entity';

@Entity('access_tokens')
@Unique(['value'])
export class AccessToken extends AbstractEntityWithUUID {
  @Column()
  value!: string;

  @Column({ default: false })
  revoked!: boolean;

  @ManyToOne(() => RefreshToken, (refreshToken) => refreshToken.accessTokens, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'refresh_token_id' })
  refreshToken!: RefreshToken;

  @Column({ name: 'expired_at' })
  expiredAt!: Date;
}
