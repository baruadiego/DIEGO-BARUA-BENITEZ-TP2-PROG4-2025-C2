import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CarModule } from './resources/car/car.module';
import { PersonModule } from './resources/person/person.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://diegobarua03_db_user:XrXAkcVwj0MTcziS@cluster0.p6dlkl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'),
    CarModule,
    PersonModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
