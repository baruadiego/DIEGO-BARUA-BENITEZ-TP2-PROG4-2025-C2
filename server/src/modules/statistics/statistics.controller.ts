import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { StatDto } from './dto/stat.dto';
import { CommentService } from '../comment/comment.service';

@Controller('stats')
export class statisticsController {
  constructor(private readonly postsService: PostService,
    private readonly commentService: CommentService
  ) {}

  @Post('posts')
  async getPostsStats(
    @Body() statDto: StatDto
  ) {
    return this.postsService.countPostsByPeriod(statDto);
  }

  @Post('comments')
  async getCommentsStats(
    @Body() statDto: StatDto
  ) {
    return  this.commentService.countCommentsByPeriod(statDto);
  }
}
