import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, MinLength } from 'class-validator';

export class LoginUserDto extends PartialType(CreateUserDto) {
  @IsString({ message: 'Identifier must be a string (email or username)' })
  readonly identifier: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  readonly password: string;
}
