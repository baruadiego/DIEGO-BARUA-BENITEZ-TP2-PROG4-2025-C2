import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private readonly postService: PostService
  ) {}
  async create(createCommentDto: CreateCommentDto, authorId: string) {
    await this.postService.findOne(createCommentDto.postId);

    const document = new this.commentModel({
      ...createCommentDto,
      author: authorId,
    });
    const comment = await document.save();

    await this.postService.comment(createCommentDto.postId);

    return { data: comment };
  }


  async findAll(postId?: string, page = 1, limit = 10) {
    const filter = {
      isDeleted: false,
    }

    if(postId) {
      filter['postId'] = postId;
    }

    const comments = await this.commentModel
      .find(filter)
      .populate({
        path: 'author',
        model: 'User',
        select: 'userName imageUrl',
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (comments.length === 0) {
      throw new NotFoundException('Comments not found');
    }

    const total = Math.ceil(
      (await this.commentModel.countDocuments(filter)) /
        limit,
    );

    return { data: comments, page, limit, total };
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentModel.findByIdAndUpdate(
      id,
      {
        content: updateCommentDto.content,
      },
      { new: true },
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return { data: comment };
  }

  async remove(id: string) {
    const comment = await this.commentModel.findOneAndUpdate(
      { 
        _id: id, 
        isDeleted: false 
      },
      { isDeleted: true },
      { new: true },
    );

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    await this.postService.unComment(comment.postId);

    return;
  }
}
