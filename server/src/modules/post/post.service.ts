import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { Model } from 'mongoose';
import { Post } from './entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  async create(postDto: PostDto, userId: string) {
    const document = new this.postModel({
      ...postDto,
      author: userId,
    });
    const post = await document.save();

    return { data: post };
  }

  async findAll(
    userId: string,
    page = 1,
    limit = 10,
    sortBy: string = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ) {
    const filter: any = { isDeleted: false };

    if (userId) {
      filter.author = userId;
    }

    const posts = await this.postModel
      .find(filter)
      .populate({
        path: 'author',
        model: 'User',
        select: 'userName imageUrl',
      })
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = Math.ceil(
      (await this.postModel.countDocuments(filter)) / limit,
    );

    return { data: posts, page, limit, total };
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'author',
        model: 'User',
        select: 'userName imageUrl',
      });

    return { data: post };
  }

  async update(id: string, updatePostDto: PostDto) {
    const post = await this.postModel.updateOne(
      {
        _id: id,
        isDeleted: false,
      },
      {
        ...updatePostDto,
      },
    );

    if (post.modifiedCount === 0) {
      throw new NotFoundException('Post not found');
    }

    return { data: updatePostDto };
  }

  async remove(id: string) {
    const post = await this.postModel.updateOne(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
    );

    if (post.modifiedCount === 0) {
      throw new NotFoundException('Post not found');
    }

    return;
  }

  async like(postId: string, userId: string) {
    const post = await this.postModel.updateOne(
      {
        _id: postId,
        isDeleted: false,
        likes: { $ne: userId },
      },
      {
        $addToSet: {
          likes: userId,
        },
        $inc: {
          likesCount: 1,
        },
      },
    );

    if (post.modifiedCount === 0) {
      throw new NotFoundException('Post not found or already liked');
    }

    return { data: post };
  }

  async unlike(postId: string, userId: string) {
    const post = await this.postModel.updateOne(
      {
        _id: postId,
        isDeleted: false,
        likes: { $in: [userId] },
      },
      {
        $pull: {
          likes: userId,
        },
        $inc: {
          likesCount: -1,
        },
      },
    );

    if (post.modifiedCount === 0) {
      throw new NotFoundException('Post not found or already unliked');
    }

    return { data: post };
  }

  async comment(postId: string) {
    const post = await this.postModel.updateOne(
      {
        _id: postId,
        isDeleted: false,
      },
      {
        $inc: {
          commentsCount: 1,
        },
      },
    );

    if (post.modifiedCount === 0) {
      throw new NotFoundException('Post not found');
    }

    return { data: post };
  }

  async unComment(postId: string) {
    const post = await this.postModel.updateOne(
      {
        _id: postId,
        isDeleted: false,
      },
      {
        $inc: {
          commentsCount: -1,
        },
      },
    );

    if (post.modifiedCount === 0) {
      throw new NotFoundException('Post not found');
    }

    return { data: post };
  }
}
