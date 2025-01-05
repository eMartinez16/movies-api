import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';

@Module({
    imports: [HttpModule, TypeOrmModule.forFeature([Film])],
    providers: [FilmsService],
    controllers: [FilmsController],
})
export class FilmsModule {}
