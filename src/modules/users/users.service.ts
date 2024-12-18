import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { TLanguage } from '@/common/types/index.e';

import { Permission } from '../permission/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';
import { RolesService } from '../roles/roles.service';

import { RegisterUserRequestDto } from './dto/user-request.dto';
import { User } from './entities/user.entity';
import { UserRole } from './entities/userRole.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    @InjectRepository(UserRole) private readonly userRolesRepository: Repository<UserRole>,
    @InjectRepository(Permission) private readonly permissionsRepository: Repository<Permission>,

    private readonly rolesService: RolesService
  ) {}

  /**
   * Tạo người dùng mới
   * @param lang - Ngôn ngữ
   * @param createUserRequestDto - Dữ liệu tạo người dùng
   * @returns Người dùng mới được tạo
   */
  //! cần update lại để không phụ thuộc các service với nhau
  async createNewUser(createUserRequestDto: RegisterUserRequestDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserRequestDto);
    const savedUser = await this.usersRepository.save(newUser);

    const addRole = await this.rolesService.createNewRole({ name: 'User', isSuperAdmin: false });
    const userRole = this.userRolesRepository.create({
      user: savedUser,
      role: addRole
    });
    await this.userRolesRepository.save(userRole);

    return newUser;
  }

  /**
   * Tìm người dùng bằng email
   * @param email - Email của người dùng
   * @returns Người dùng tìm thấy
   */
  // async addPermissionToUser(user: User, permission: Permission) {
  //   // Kiểm tra xem quyền có hợp lệ hay không
  //   const userPermissions = RolePermissions[user.role] || [];

  //   if (!userPermissions.includes(permission)) {
  //     userPermissions.push(permission); // Thêm quyền mới
  //   }

  //   // Cập nhật quyền của người dùng trong cơ sở dữ liệu
  //   user.permissions = userPermissions;
  // }
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['userRoles', 'userRoles.user', 'userRoles.role']
    });
    console.log('user', user);
    console.log('User ID:', user?.id);
    console.log('User Full Name:', user?.fullName);
    const roles = user.userRoles.map((userRole) => userRole.role?.name);

    if (user?.userRoles && user.userRoles.length > 0) {
      user.userRoles.forEach((userRole) => {
        console.log('Role ID:', userRole.role?.id);
        console.log('Role Name:', userRole.role?.name);
      });
    }
    const userWithRoles = {
      ...user,
      roles: roles
    } as unknown as User;
    return userWithRoles as User;
  }

  /**
   * Tìm người dùng bằng ID
   * @param lang - Ngôn ngữ
   * @param id - ID của người dùng
   * @returns Người dùng tìm thấy
   */
  async findUserById(id: string, relations: string[] = []): Promise<User> {
    if (!id || id.trim() === '') {
      throw new BadRequestException('invalid_id');
    }

    const user = await this.usersRepository.findOne({ where: { id }, relations });

    if (!user) {
      throw new NotFoundException('user_not_found');
    }

    return user;
  }

  /**
   * Tìm danh sách người dùng theo danh sách ID
   *
   * @param lang - Ngôn ngữ cần sử dụng để trả về thông báo lỗi (nếu có).
   * @param ids - Danh sách các ID của người dùng cần tìm.
   * @returns Một mảng người dùng chứa thông tin của người dùng
   */
  async findUsersByIds(ids: string[], relations: string[] = []): Promise<User[]> {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('invalid_ids');
    }

    const users = await this.usersRepository.find({
      where: { id: In(ids) },
      relations: relations
    });

    if (users.length === 0) {
      throw new NotFoundException('user.not_found');
    }

    return users;
  }

  /**
   * Cập nhật mật khẩu của người dùng
   * @param lang - Ngôn ngữ
   * @param id - ID của người dùng
   * @param newPassword - Mật khẩu mới
   * @returns Người dùng đã được cập nhật
   */
  async updatePassword(id: string, newPassword: string): Promise<User> {
    const user = await this.findUserById(id);
    user.password = newPassword;
    return this.usersRepository.save(user);
  }

  /**
   * Kiểm tra quyền của người dùng
   * @param userId - ID của người dùng
   * @param permission - Quyền cần kiểm tra
   * @returns true nếu người dùng có quyền, false nếu không
   */
  // async hasPermission(userId: string, permissionKey: string): Promise<boolean> {
  //   const user = await this.usersRepository.findOne({
  //     where: { id: userId },
  //     relations: ['userRoles', 'userRoles.role', 'userRoles.role.permissions']
  //   });

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return user.userRoles.some((userRole) => userRole.role.permissions.some((p) => p.key === permissionKey));
  // }
  async hasPermission(userId: string, permissionKey: string): Promise<boolean> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.userRoles', 'userRole') // Join với userRoles
      .innerJoinAndSelect('userRole.role', 'role') // Join với role
      .innerJoinAndSelect('role.permissions', 'permission') // Join với permissions
      .where('user.id = :userId', { userId }) // Lọc theo userId
      .andWhere('permission.key = :permissionKey', { permissionKey }) // Kiểm tra quyền
      .getOne(); // Lấy một kết quả duy nhất

    // Nếu không tìm thấy người dùng hoặc quyền, ném lỗi
    if (!result) {
      throw new NotFoundException('User or Permission not found');
    }

    // Trả về true nếu có quyền, ngược lại false
    return true;
  }
}
