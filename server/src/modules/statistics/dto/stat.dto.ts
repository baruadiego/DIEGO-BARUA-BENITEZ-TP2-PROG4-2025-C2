import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

export enum GroupBy {
  DAY_OF_WEEK = 'day',
  DAY_OF_MONTH = 'dayOfMonth',
  MONTH = 'month',
  YEAR = 'year',
  USER = 'user',
  POST = 'post',
};
export class StatDto{
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsEnum(GroupBy)
  groupBy?: GroupBy;
}