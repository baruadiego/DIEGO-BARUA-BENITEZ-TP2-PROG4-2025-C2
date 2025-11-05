import { IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString({ message: 'Content must be a string' })
  @MaxLength(180, { message: 'Content must not exceed 180 characters' })
  content: string

  @IsString({ message: 'Post ID must be a string' })
  postId: string
}
