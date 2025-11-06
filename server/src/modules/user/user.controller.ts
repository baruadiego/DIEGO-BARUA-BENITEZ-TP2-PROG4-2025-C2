import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostService } from '../post/post.service';
import type { Request } from 'express';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie/auth-cookie.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService
  ) {}

  @Get('posts')
  @UseGuards(AuthCookieGuard)
  getPostByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: Request
  ){
    const id = (req as any).user['id'];
    return this.postService.findAll(id, page, limit);
  }

  @Get('activity')
  @UseGuards(AuthCookieGuard)
  getUserActivity(
    @Req() req: Request
  ){
    const id = (req as any).user['id'];
    
    return this.userService.getActivity(id);
  }

  @Get(':identifier')
  findOne(@Param('identifier') identifier: string) {
    console.log(identifier);
    
    return this.userService.findOne(identifier);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
