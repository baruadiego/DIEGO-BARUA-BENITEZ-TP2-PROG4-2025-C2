import {
  IsString,
  IsEmail,
  IsDateString,
  IsEnum,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { User, UserRole } from '../entities/user.entity';


export class CreateUserDto {
  static readonly keys: (keyof CreateUserDto)[] = [
    'name',
    'lastname',
    '_id',
    'email',
    'userName',
    'imageUrl',
    'role',
    'description',
    'isActive',
  ];
  
  @IsOptional()
  _id?: string;

  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must have at least 2 characters' })
  name: string;

  @IsString({ message: 'Lastname must be a string' })
  @MinLength(2, { message: 'Lastname must have at least 2 characters' })
  lastname: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @IsString({ message: 'Username must be a string' })
  @MinLength(3, { message: 'Username must have at least 3 characters' })
  @MaxLength(20, { message: 'Username must not exceed 20 characters' })
  userName: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  password: string;

  @IsEnum(UserRole, { message: 'Role must be either "admin" or "user"' })
  role?: UserRole;

  @IsDateString({}, { message: 'Birth date must be a valid date (YYYY-MM-DD)' })
  birthDate: Date;

  @IsString({ message: 'Description must be a string' })
  @MaxLength(255, { message: 'Description must not exceed 255 characters' })
  description: string;
  
  @IsString({ message: 'Image URL must be a string' })
  imageUrl: string;
  
  @IsString({ message: 'Image path must be a string' })
  imagePath: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  isActive?: boolean;
}
