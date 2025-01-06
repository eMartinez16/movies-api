
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { ConfigService } from '@nestjs/config';
import { FilmResponseDto } from './responses/film.response.dto';
import { FilmsController } from './films.controller';
import { of } from 'rxjs';


jest.mock('@nestjs/axios');
jest.mock('@nestjs/config');
jest.mock('@nestjs/typeorm');

describe('FilmsService', () => {
  let service: FilmsService;
  let controller: FilmsController;
  let repository: Repository<Film>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: getRepositoryToken(Film),
          useClass: Repository,
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(`${process.env.SW_API_ENDPOINT}`) },
        }
      ],
    }).compile();
  
    service = module.get<FilmsService>(FilmsService);
    controller = module.get<FilmsController>(FilmsController);
    repository = module.get<Repository<Film>>(getRepositoryToken(Film));
  });

  describe('getAllFilms', () => {
    it('should return all films including data from API and DB', async () => {
      
      const apiData = { data: { results: [{ title: 'A New Hope', id: 1 }] } };
      jest.spyOn(service['_httpService'], 'get' as keyof typeof service['_httpService']).mockResolvedValueOnce(apiData);



      const filmsInDb: Film[] = [
        { 
          id: 2,
          title: 'The Empire Strikes Back',
          producer: 'Lucasfilm', 
          episodeId: 3,
          director: 'Irvin Kershner', 
          releaseDate: new Date('1980-05-17'),
          updatedAt: new Date('1980-05-17'),
          deletedAt: null,
          openingCrawl: 'It is a dark time for the Rebellion...',          
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(filmsInDb);

      const result = await service.getAllFilms();

      const expectedResult: FilmResponseDto[] = [
        service.mapFilm(filmsInDb[0]),
        service.mapFilm({ id: 1, title: 'A New Hope', producer: '', episode_id: 4, director: '', releaseDate: '', openingCrawl: '' } as any), // API film
      ];

      expect(result.films).toEqual(expectedResult);
    });
  });

  describe('getFilmById', () => {
    it('should return a film by ID', async () => {
      const film: FilmResponseDto = {
        id: 1,
        title: 'A New Hope',
        producer: 'Lucasfilm',
        episodeId: 4,
        director: 'George Lucas',
        releaseDate: new Date('1977-05-25'),
        openingCrawl: 'It is a period of civil war...',
      };

      jest.spyOn(service, 'getFilmById').mockResolvedValueOnce(film);

      const result = await controller.getFilmById(1);

      expect(result.title).toBe('A New Hope');
      expect(result.id).toBe(1);
    });
  });

  describe('createFilm', () => {
    it('should create a film', async () => {
      const createFilmDto = {
        title: 'A New Hope',
        producer: 'Lucasfilm',
        episodeId: 4,
        director: 'George Lucas',
        releaseDate: new Date('1977-05-25'),
        openingCrawl: 'It is a period of civil war...',
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce({
        message: 'Film created successfully',
      });

      const result = await controller.createFilm(createFilmDto);

      expect(result.message).toBe('Film created successfully');
    });
  });

  describe('deleteFilm', () => {
    it('should delete a film by ID', async () => {
      jest.spyOn(service, 'delete').mockResolvedValueOnce('Film deleted successfully');

      const result = await controller.deleteFilm(1);

      expect(result).toBe('Film deleted successfully');
    });
  });

  describe('syncFilms', () => {
    it('should synchronize films', async () => {

      const apiData = { data: { results: [{ title: 'A New Hope', id: 1 }] } };

      const filmsInDb: Film[] = [
        { 
          id: 2,
          title: 'The Empire Strikes Back',
          producer: 'Lucasfilm', 
          episodeId: 3,
          director: 'Irvin Kershner', 
          releaseDate: new Date('1980-05-17'),
          updatedAt: new Date('1980-05-17'),
          deletedAt: null,
          openingCrawl: 'It is a dark time for the Rebellion...',          
        },
      ];
  
      jest.spyOn(service['_httpService'], 'get' as keyof typeof service['_httpService']).mockResolvedValueOnce(apiData);
      jest.spyOn(repository, 'find').mockResolvedValue(filmsInDb);
  
      const logSpy = jest.spyOn(console, 'log').mockImplementation();
  
      await service.syncFilms();
  
      expect(service.getAllFilms).toHaveBeenCalledWith(`${process.env.SW_API_ENDPOINT}`);
      expect(repository.find).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('Successfully synchronized 3 films.');
    });
  
    it('should handle errors during synchronization', async () => {
      const errorMessage = 'Something went wrong!';

      jest.spyOn(service['_httpService'], 'get' as keyof typeof service['_httpService']).mockRejectedValue(new Error(errorMessage));
  

      const logErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  
      await service.syncFilms();
  
      expect(logErrorSpy).toHaveBeenCalledWith(`Error synchronizing films: ${errorMessage}`);
    });
  })
});
