import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonDto } from './dto/person.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post()
  create(@Body() createPersonDto: PersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll(
    @Param('page') page = 1,
    @Param('limit') limit = 10,
  ) {
    return this.personService.findAll(+page, +limit);
  }

  @Get(':dni')
  findOne(@Param('dni') dni: string) {
    return this.personService.findOne(dni);
  }

  @Delete(':id')
  remove(@Param('dni') dni: string) {
    return this.personService.remove(dni);
  }
}
