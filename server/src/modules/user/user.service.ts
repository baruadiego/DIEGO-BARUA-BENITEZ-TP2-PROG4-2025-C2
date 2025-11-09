import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Mapper } from 'src/common/utils/mapper.util';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private postService: PostService,
    private commentService: CommentService
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.userModel.find();

    return { data:Mapper.toDtoList<CreateUserDto>(users, CreateUserDto.keys) };
  }

  async findOne(identifier: string) {
    const user = await this.userModel.findOne({
      $or: [
        { email: identifier },
        { userName: identifier },
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      data: Mapper.toDto<CreateUserDto>(user, CreateUserDto.keys),
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getActivity(id: string) {
    const data = await this.postService.activityByUser(id);
    const comments = await this.commentService.commentsByUser(id);

    return { data: {likes: data.likes, posts: data.posts, comments} };
  }
}
