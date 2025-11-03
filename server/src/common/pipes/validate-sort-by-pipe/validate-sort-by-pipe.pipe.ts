import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateSortByPipe implements PipeTransform {
  constructor(private readonly allowedFields: string[]) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && !this.allowedFields.includes(value)) {
      throw new BadRequestException(`"${value}" is not a valid field to sort.`);
    }
    return value;
  }
}
