import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsString, MaxLength } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsString({ message: 'Content must be a string' })
  @MaxLength(180, { message: 'Content must not exceed 180 characters' })
  content: string;
}
