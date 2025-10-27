import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PersonDto } from './dto/person.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Person } from './entities/person.entity';
import { Model } from 'mongoose';
import { Mapper } from 'src/common/utils/mapper.util';
import { sign } from 'jsonwebtoken';

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);
  constructor(@InjectModel(Person.name) private personModel: Model<Person>) {}

  async create(createPersonDto: PersonDto) {
    const document = new this.personModel(createPersonDto);
    const person = await document.save();
    const data = Mapper.toDto<PersonDto>(person, PersonDto.keys);

    return { data };
  }

  async findAll(page = 1, limit = 10, sortBy: string, order?: 'asc' | 'desc') {
    const persons = await this.personModel
      .find()
      .limit(limit)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .exec();
    const total = Math.ceil(await this.personModel.countDocuments() / limit);
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
    const data = await this.personModel.deleteOne({ dni });

    if (!data) {
      throw new NotFoundException(
        `No se encontró una persona con dni ${dni} en la base de dtos`,
      );
    }

    return data;
  }

  async login(loginPersonDto: PersonDto) {
    const person = await this.personModel.findOne({ dni: loginPersonDto.dni });

    if (person) {
      const payload = { dni: person.dni, name: person.name, lastname: person.lastname };
      const token = sign(payload, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      })
      
      return  token;
    } 

    return false;
  }
}
