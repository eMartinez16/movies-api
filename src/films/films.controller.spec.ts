
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { ConfigService } from '@nestjs/config';
import { FilmMapper } from './mappers/film.mapper';
import { FilmResponseDto } from './responses/film.response.dto';

jest.mock('@nestjs/axios');
jest.mock('@nestjs/config');
jest.mock('@nestjs/typeorm');

describe('FilmsService', () => {
  let service: FilmsService;
  let repository: Repository<Film>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          useValue: { get: jest.fn().mockReturnValue('https://swapi.dev/api/films/') },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<Repository<Film>>(getRepositoryToken(Film));
  });

  describe('getAllFilms', () => {
    it('should return all films including data from API and DB', async () => {
      // Mocking the response from the HTTP call
      const apiData = { data: { results: [{ title: 'A New Hope', id: 1 }] } };
      jest.spyOn(service['_httpService'], 'get').mockResolvedValueOnce(apiData as any);

      // Mocking the films from the DB
      const filmsInDb: Film[] = [
        { id: 2, title: 'The Empire Strikes Back', producer: 'Lucasfilm', episode_id: 5, director: 'Irvin Kershner', releaseDate: '1980-05-17', openingCrawl: 'It is a dark time for the Rebellion...' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(filmsInDb);

      // Call the service method
      const result = await service.getAllFilms();

      // We expect the result to include the DB and API films
      const expectedResult: FilmResponseDto[] = [
        FilmMapper.toDto(filmsInDb[0]), // DB film
        FilmMapper.toDto({ id: 1, title: 'A New Hope', producer: '', episode_id: 4, director: '', releaseDate: '', openingCrawl: '' } as any), // API film
      ];

      expect(result.films).toEqual(expectedResult);
    });
  });

  // Aquí también puedes agregar los tests para los demás métodos como `getFilmById`, `create`, etc.
});
