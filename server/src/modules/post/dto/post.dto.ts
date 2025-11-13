import { IsOptional, IsString, MaxLength } from "class-validator";

export class PostDto {
  @IsString({ message: 'Title must be a string' })
  @MaxLength(50, { message: 'Title must not exceed 50 characters' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @MaxLength(280, { message: 'Content must not exceed 280 characters' })
  content: string;

  @IsString({ message: 'Image URL must be a string' })
  @IsOptional()
  imageUrl?: string;

  @IsString({ message: 'Image path must be a string' })
  @IsOptional()
  imagePath?: string;
}
