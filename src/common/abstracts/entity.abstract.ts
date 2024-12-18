import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  DataSource,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export abstract class BaseEntityWithTimestamps extends BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', precision: 0, default: () => 'CURRENT_TIMESTAMP' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', precision: 0, nullable: true })
  @Exclude()
  deletedAt?: Date;

  @BeforeInsert()
  setDefaults() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}

export abstract class AbstractEntityWithNumberId extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn()
  id: number;

  static useDataSource(dataSource: DataSource) {
    BaseEntityWithTimestamps.useDataSource.call(this, dataSource);
    const meta = dataSource.entityMetadatasMap.get(this);
    if (meta) {
      const timestampColumns = meta.columns.filter((column) =>
        ['createdAt', 'updatedAt', 'deletedAt'].includes(column.propertyName)
      );
      const otherColumns = meta.columns.filter(
        (column) => !['createdAt', 'updatedAt', 'deletedAt'].includes(column.propertyName)
      );
      meta.columns = [...otherColumns, ...timestampColumns];
    }
  }
}

export abstract class AbstractEntityWithUUID extends BaseEntityWithTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  static useDataSource(dataSource: DataSource) {
    BaseEntityWithTimestamps.useDataSource.call(this, dataSource);
    const meta = dataSource.entityMetadatasMap.get(this);
    if (meta) {
      // Move timestamp columns to the end in the desired order
      const timestampColumns = meta.columns.filter((column) =>
        ['createdAt', 'updatedAt', 'deletedAt'].includes(column.propertyName)
      );
      const otherColumns = meta.columns.filter(
        (column) => !['createdAt', 'updatedAt', 'deletedAt'].includes(column.propertyName)
      );
      meta.columns = [...otherColumns, ...timestampColumns];
    }
  }
}
