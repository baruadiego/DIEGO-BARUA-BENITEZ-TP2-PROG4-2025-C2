import { Module } from '@nestjs/common';
import { CommentModule } from '../comment/comment.module';
import { PostModule } from '../post/post.module';
import { statisticsController } from './statistics.controller';

@Module({
  imports: [
    CommentModule, PostModule
  ],
  controllers: [statisticsController],
})
export class statisticsModule {}
