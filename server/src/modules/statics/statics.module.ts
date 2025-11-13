import { Module } from '@nestjs/common';
import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';
import { StaticsController } from './statics.controller';

@Module({
  imports: [
    CommentModule, PostModule
  ],
  controllers: [StaticsController],
})
export class StaticsModule {}
