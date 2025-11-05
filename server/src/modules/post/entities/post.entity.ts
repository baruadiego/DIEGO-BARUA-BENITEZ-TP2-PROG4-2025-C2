import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Post {
  _id: Types.ObjectId;

  @Prop({ required: true })
  author: string;

  @Prop({required: true})
  title: string;

  @Prop({required: true})
  content: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  imagePath?: string;

  @Prop({ default: [] })
  likes: string[];

  @Prop({ default: 0 })
  likesCount: number;

  @Prop({ default: 0})
  commentsCount: number;

  @Prop({ default: false})
  isDeleted: boolean;

  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);