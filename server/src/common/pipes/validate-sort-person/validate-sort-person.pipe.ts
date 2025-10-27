import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PersonDto } from 'src/modules/person/dto/person.dto';
import { Person } from 'src/modules/person/entities/person.entity';

@Injectable()
export class ValidateSortPersonPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const allowed = PersonDto.keys;
    if (value && !allowed.includes(value as keyof Person)) {
      throw new BadRequestException(`El campo "${value}" no es un campo válido para ordenar.`);
    }
    return value;
  }
}
