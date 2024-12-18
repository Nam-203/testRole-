import { DataSource } from 'typeorm';

import { dataSourceOptions } from '@/modules/database/data-source';

import { seedUsers } from './user.seed';

async function seedData() {
  const connection = new DataSource(dataSourceOptions);
  await connection.initialize();

  await seedUsers(connection);

  await connection.destroy();
}

seedData()
  .then(() => console.log('Data seeding completed'))
  .catch((error) => console.error('Error during data seeding:', error));
