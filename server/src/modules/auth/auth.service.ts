import {
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
    refreshToken: string;
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

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.authorize(user);
  }

  async register(
    newUser: CreateUserDto,
  ): Promise<{
    data: CreateUserDto;
    accessToken: string;
    refreshToken: string;
  }> {
    newUser.password = await bcrypt.hash(newUser.password, this.saltRounds);
    const document = new this.userModel(newUser);
    const user = await document.save();

    return await this.authorize(user);
  }

  createToken(user: User, refresh = false): string {
    const payload = {
      id: user._id.toString(),
      userName: user.userName,
      role: user.role,
    };

    const token = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: refresh ? '7d' : '15m',
    });

    return token;
  }

  async authorize(user: User): Promise<{
    data: CreateUserDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const refreshToken = this.createToken(user, true).toString();
    const accessToken = this.createToken(user).toString();

    this.userModel
      .updateOne(
        { _id: user._id },
        { refreshToken: await bcrypt.hash(refreshToken, 10) },
      )
      .exec();

    return {
      data: Mapper.toDto<CreateUserDto>(user, CreateUserDto.keys),
      accessToken,
      refreshToken,
    };
  }

  async deleteRefreshToken(id: string) {
    const objectId = new Types.ObjectId(id);
    await this.userModel.updateOne({ _id: objectId }, { refreshToken: null }).exec();
  }

  async refreshToken(id: string, refreshToken: string) {
    const objectId = new Types.ObjectId(id);
    const user = await this.userModel.findOne({ _id: objectId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token stored');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return await this.createToken(user, true);
  }
}
