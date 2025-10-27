import { IsDefined, IsString, Length, Matches } from 'class-validator';

export class PersonDto {
  static keys: (keyof PersonDto)[] = ['dni', 'name', 'lastname'];

  @IsString()
  @IsDefined({ message: 'El DNI es obligatorio' })
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  @Matches(/^[0-9]+$/, { message: 'El DNI solo puede contener números' })
  dni: string;

  @IsString()
  @IsDefined({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'El nombre solo puede contener letras' })
  name: string;

  @IsString()
  @IsDefined({ message: 'El nombre es obligatorio' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'El nombre solo puede contener letras' })
  lastname: string;
}
