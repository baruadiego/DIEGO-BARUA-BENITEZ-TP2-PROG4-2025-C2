import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../user/entities/user.entity';
import { Model, Types } from 'mongoose';
import { Mapper } from 'src/common/utils/mapper.util';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 10;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{
    data: CreateUserDto;
    accessToken: string;
  }> {
    const user = await this.userModel.findOne({
      $or: [
        { email: loginUserDto.identifier },
        { userName: loginUserDto.identifier },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenException('User is not active');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      data: Mapper.toDto<CreateUserDto>(user, CreateUserDto.keys),
      accessToken: this.createToken(user),
    };
  }

  async register(
    newUser: CreateUserDto,
  ): Promise<{
    data: CreateUserDto;
  }> {
    newUser.password = await bcrypt.hash(newUser.password, this.saltRounds);
    const document = new this.userModel(newUser);
    const user = await document.save();

    return {
      data: Mapper.toDto<CreateUserDto>(user, CreateUserDto.keys)
    }
  }

  createToken(user: User): string {
    const payload = {
      id: user._id.toString(),
      userName: user.userName,
      imageUrl: user.imageUrl,
      role: user.role,
    };

    const token = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });

    return token;
  }


  async refreshToken(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.createToken(user)
  }
}
