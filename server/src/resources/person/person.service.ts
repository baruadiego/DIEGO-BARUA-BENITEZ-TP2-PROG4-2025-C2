import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PersonDto } from './dto/person.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Person } from './entities/person.entity';
import { Model } from 'mongoose';
import { Mapper } from 'src/common/utils/mapper.util';

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);
  constructor(@InjectModel(Person.name) private personModel: Model<Person>) {}

  async create(createPersonDto: PersonDto) {
    const document = new this.personModel(createPersonDto);
    const person = await document.save();
    
    return Mapper.toDto<PersonDto>(person, PersonDto.keys);
  }

  async findAll(page = 1, limit = 10) {
    const persons = await this.personModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const total = await this.personModel.countDocuments();
    const data = Mapper.toDtoList<PersonDto>(persons, PersonDto.keys);

    return { data, page, limit, total };
  }

  async findOne(dni: string) {
    const person = await this.personModel.findOne({ dni });

    if (!person) {
      throw new NotFoundException(
        `No se encontró una persona con dni ${dni} en la base de dtos`,
      );
    }

    return Mapper.toDto<PersonDto>(person, PersonDto.keys);
  }

  async remove(dni: string) {
    const person = await this.personModel.deleteOne({ dni });

    if (!person) {
      throw new NotFoundException(
        `No se encontró una persona con dni ${dni} en la base de dtos`,
      );
    }

    return person;
  }
}
