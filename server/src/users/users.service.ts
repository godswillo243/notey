import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../db/models/user.model';
import { type ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '@m8a/nestjs-typegoose';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Types } from 'mongoose';
<<<<<<< HEAD
import { throwError } from 'rxjs';
=======
>>>>>>> 58b45b5 (Implement note management and user profile features)

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }) as unknown as Promise<User>;
  }

  async findById(id: string) {
    return this.userModel.findById(id) as unknown as Promise<User>;
  }
  async findByVerificationToken(token: string) {
    return this.userModel.findOne({
      verificationToken: token,
    }) as unknown as Promise<User>;
  }
  async findByResetPasswordToken(token: string) {
    return this.userModel.findOne({
      resetPasswordToken: token,
    }) as unknown as Promise<User>;
  }

  async getUserProfile(id: string) {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) throw new BadRequestException('Invalid user id.');
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User profile not found.');
    if (!user.isVerified) throw new BadRequestException('Invalid user id.');

    return this.serialize(user);
  }

  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async update(id: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
    }) as unknown as Promise<User>;
  }

  async updateProfile(id: string, dto: UpdateUserProfileDto) {
    const user = (await this.userModel.findByIdAndUpdate(id, dto, {
      returnDocument: 'after',
    })) as unknown as User;

    return this.serialize(user);
  }

  serialize(user: User & { id: string }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
/*

User
├── name
├── email
├── password
├── avatar
├── bio
├── emailVerified
├── role
├── refreshToken
├── lastLogin
├── createdAt
└── updatedAt

*/
