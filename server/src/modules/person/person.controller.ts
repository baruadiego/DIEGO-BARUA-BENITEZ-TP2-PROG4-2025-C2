import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonDto } from './dto/person.dto';
import { ValidateDniPipe } from 'src/common/pipes/validate-dni/validate-dni.pipe';
import { ValidateSortPersonPipe } from 'src/common/pipes/validate-sort-person/validate-sort-person.pipe';
import { AuthCookieGuard } from 'src/common/guards/auth-cookie/auth-cookie.guard';
import type { Response } from 'express';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @UseGuards(AuthCookieGuard)
  @Post()
  create(@Body() createPersonDto: PersonDto) {
    return this.personService.create(createPersonDto);
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy', new ValidateSortPersonPipe()) sortBy = 'name',
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ) {
    return this.personService.findAll(+page, +limit, sortBy, order);
  }

  @Get(':dni')
  findOne(@Param('dni', new ValidateDniPipe()) dni: string) {
    return this.personService.findOne(dni);
  }

  @Delete(':id')
  remove(@Param('dni') dni: string) {
    return this.personService.remove(dni);
  }

  @Post('login')
  async login(
    @Body() loginPersonDto: PersonDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.personService.login(loginPersonDto);
    
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false, 
      expires: new Date(Date.now() + 60 * 1000 * 60)
    });

    return { message: 'Login successful' };
  }
}
