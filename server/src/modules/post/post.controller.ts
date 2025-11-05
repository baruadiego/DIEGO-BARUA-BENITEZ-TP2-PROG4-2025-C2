import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie/auth-cookie.guard';
import type { Request } from 'express';
import { ValidateSortByPipe } from 'src/common/pipes/validate-sort-by-pipe/validate-sort-by-pipe.pipe';

@Controller('post')
@UseGuards(AuthCookieGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  create(@Req() req: Request, @Body() postDto: PostDto) {
    const userId = (req as any).user['id'];
    return this.postService.create(postDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: PostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy', new ValidateSortByPipe(['likesCount', 'createdAt']))
    sortBy = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'desc',
  ) {
    return this.postService.findAll(userId, +page, +limit, sortBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @Put(':id/like')
  like(
    @Param('id') postId: string,
    @Req() req: Request
  ) {
    const userId = (req as any).user['id'];
    return this.postService.like(postId, userId);
  }

  @Put(':id/unlike')
  unlike(
    @Param('id') postId: string,
    @Req() req: Request
  ) {
    const userId = (req as any).user['id'];
    return this.postService.unlike(postId, userId);
  }
}
