import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie/auth-cookie.guard';
import type { Request } from 'express';

@Controller('comment')
@UseGuards(AuthCookieGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request
  ) {
    const authorId = (req as any).user['id'];
    return this.commentService.create(createCommentDto, authorId);
  }

  @Get()
  findAll(
    @Query ('page') page = 1,
    @Query ('limit') limit = 10,
    @Query ('postId') postId: string
  ) {
    return this.commentService.findAll(postId, page, limit);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
