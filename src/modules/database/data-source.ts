import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import 'reflect-metadata';

config();

export const dataSourceOptions = {
  type: 'mysql' as any,
  host: process.env.MYSQL_HOST,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_ROOT_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: !!process.env.MYSQL_SYNCHRONIZE,
  dropSchema: false,
  entities: ['dist/modules/**/*.entity{.ts,.js}'],
  migrations: ['dist/modules/database/migrations/*{.ts,.js}', 'src/database/seeds/*.sql'],
  timezone: 'Z'
};

export default new DataSource(dataSourceOptions);
