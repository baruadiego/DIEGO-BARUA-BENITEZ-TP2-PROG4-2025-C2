import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
import { StaticsModule } from './modules/statics/statics.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://diegobarua03_db_user:XrXAkcVwj0MTcziS@cluster0.p6dlkl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    AuthModule,
    SupabaseModule,
    PostModule,
    CommentModule,
    StaticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
