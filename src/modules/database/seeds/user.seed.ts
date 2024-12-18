import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { User } from '../../users/entities/user.entity';

export async function seedUsers(connection: DataSource) {
  const userRepository = connection.getRepository(User);

  const plainPassword = '123456';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const users = [
    {
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Admin User',
      phone: '0123456789',
      gender: 1,
      address: '123 Hoang Dieu',
      avatar: null,
      status: 1
    },
    {
      email: 'user@example.com',
      password: hashedPassword,
      fullName: 'Normal User',
      phone: '0987654321',
      gender: 2,
      address: '456 Hoang Dieu',
      avatar: null,
      status: 1
    }
    // Add more user data if needed
  ];

  // Save users and create employment histories
  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
  }
}
