
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateFilmDto } from './dto/create-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FilmResponseDto } from './responses/film.response.dto';

@Injectable()
export class FilmsService {
  swApiUrl: string = '';
  private readonly logger = new Logger(FilmsService.name);

  constructor(
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService,
    @InjectRepository(Film)
    private readonly _filmRepository: Repository<Film>,
  ) {
    this.swApiUrl = this._configService.get('SW_API_ENDPOINT');
  }

  mapFilm(film): FilmResponseDto{
    return {
      id: film.id,
      title: film.title,
      producer: film.producer,
      episodeId: film.episodeId,
      director: film.director,
      releaseDate: film.releaseDate,
      openingCrawl: film.openingCrawl,
    };
  }

  toDtoArray(films: Film[]): FilmResponseDto[] {
    return films.map(film => this.mapFilm(film));
  }

  async getAllFilms() {
    try {
      const apiData = await firstValueFrom(this._httpService.get(this.swApiUrl));
      
      const filmsOnDb = await this._filmRepository.find();

      const filmsDto = this.toDtoArray([
        ...filmsOnDb, 
        ...(apiData.data || [])
      ]);
      return { films: filmsDto };
    } catch (error) {
      throw new Error(`Error fetching films: ${error.message}`);
    }
  }

 

  async getFilmById(id: number) {
    try {
      const existsOnDb = await this._filmRepository.findOne({ where: { id } });
  
      if (existsOnDb) return this.mapFilm(existsOnDb);
  
      const response = await firstValueFrom(this._httpService.get(`${this.swApiUrl}${id}`));
  
      return this.mapFilm(response.data);
      
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new NotFoundException('Film not found');
      }
  
      throw new Error('An unexpected error occurred while fetching the film');
    }
  }

  async create(dto: CreateFilmDto): Promise<{ message: string }> {
    try {
      await this._filmRepository.save(dto);
      
      return { message: 'Film created successfully' };
    } catch (error) {
      throw new Error('Error creating film');
    }
  }

  async update(id: number, updateUserDto: UpdateFilmDto) {
    try {
      const film = await this.getFilmById(id);

      if (!film) throw new NotFoundException();

      const modifiedFilm = Object.assign(film, updateUserDto);

      await this._filmRepository.save(modifiedFilm);

      return await this.getFilmById(id);
    } catch (error) {
      throw new Error('Error updating film');
    }
  }

  async delete(id: number) {
    try {
      const film = await this.getFilmById(id);

      if (!film) throw new NotFoundException();

      await this._filmRepository.softDelete(film.id)

      return 'Film successfully deleted'

    } catch (error) {
      console.log(error);
      throw new Error('Error deleting film');
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async syncFilms() {
    this.logger.log('Synchronizing films from API and DB...');
    try {
      const apiData = await firstValueFrom(this._httpService.get('https://swapi.dev/api/films/'));
      const filmsOnDb = await this._filmRepository.find();

      const combinedFilms = [...filmsOnDb, ...apiData.data.results];

      this.logger.log(`Successfully synchronized ${combinedFilms.length} films.`);
    } catch (error) {
      this.logger.error(`Error synchronizing films: ${error.message}`);
    }
  }
}
