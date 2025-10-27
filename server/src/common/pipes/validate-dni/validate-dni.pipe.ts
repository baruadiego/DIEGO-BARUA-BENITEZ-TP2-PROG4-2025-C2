import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateDniPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const dniRegex = /^\d{7,8}$/;
    if (!dniRegex.test(value)) {
      throw new BadRequestException('DNI inválido. Debe tener 8 dígitos numericos.');
    }
    return value;
  }
}
