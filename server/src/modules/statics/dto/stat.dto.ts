import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum GroupBy {
  DAY_OF_WEEK = 'day',
  DAY_OF_MONTH = 'dayOfMonth',
  MONTH = 'month',
  YEAR = 'year',
};
export class StatDto{
  @IsOptional()
  @IsString({ message: 'User ID must be a string' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'Post ID must be a string' })
  postId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(GroupBy)
  groupBy?: GroupBy;
}