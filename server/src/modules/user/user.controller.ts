import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PostService } from '../post/post.service';
import type { Request } from 'express';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie/auth-cookie.guard';
import { AdminGuard } from 'src/common/guards/admin/admin.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @Get('posts')
  @UseGuards(AuthCookieGuard)
  getPostByUser(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Req() req: Request,
  ) {
    const id = (req as any).user['id'];
    return this.postService.findAll(id, page, limit);
  }

  @Get(':id/activity')
  @UseGuards(AuthCookieGuard)
  getUserActivity(@Req() req: Request, @Param('id') id: string) {
    return this.userService.getActivity(id);
  }

  @Get(':identifier')
  findOne(@Param('identifier') identifier: string) {
    return this.userService.findOne(identifier);
  }

  @Get()
  @UseGuards(AuthCookieGuard, AdminGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthCookieGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/enable')
  @UseGuards(AuthCookieGuard, AdminGuard)
  enable(@Param('id') id: string) {
    return this.userService.enable(id);
  }

  @Patch(':id/change-role')
  @UseGuards(AuthCookieGuard, AdminGuard)
  changeRole(@Param('id') id: string, @Body('role') role: 'admin' | 'user') {
    if (role !== 'admin' && role !== 'user') {
      throw new BadRequestException('Invalid role');
    }
    return this.userService.changeRole(id, role);
  }
}
