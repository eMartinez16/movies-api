import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { ConfigService } from '@nestjs/config';
import { FilmResponseDto } from './responses/film.response.dto';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { Observable, of } from 'rxjs';

// Define la estructura de la respuesta de la API
interface ApiResponse {
  results: Array<{ title: string; id: number; producer?: string; episode_id?: number; director?: string; releaseDate?: string; openingCrawl?: string }>;
}

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
          useValue: { get: jest.fn() },  // Mock del método 'get'
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
      // Datos de la respuesta de la API mockeada
      const apiData: ApiResponse = { results: [{ title: 'A New Hope', id: 1 }] };

      // Creamos la respuesta completa de Axios
      const axiosResponse: AxiosResponse<ApiResponse> = {
        data: apiData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { headers: {} as AxiosRequestHeaders}
      };

      // Mockeamos la función 'get' para que retorne la respuesta mockeada
      jest.spyOn(service['_httpService'], 'get').mockResolvedValueOnce(of(axiosResponse));

      // Mockeamos los datos de los films en la base de datos
      const filmsInDb: Film[] = [
        { id: 2, title: 'The Empire Strikes Back', producer: 'Lucasfilm', episode_id: 5, director: 'Irvin Kershner', releaseDate: '1980-05-17', openingCrawl: 'It is a dark time for the Rebellion...' },
      ];

      jest.spyOn(repository, 'find').mockResolvedValueOnce(filmsInDb);

      // Llamamos al método del servicio
      const result = await service.getAllFilms();

      // Resultado esperado (incluir tanto los films de la DB como de la API)
      const expectedResult: FilmResponseDto[] = [
        new FilmResponseDto(filmsInDb[0]), // Film de la DB
        new FilmResponseDto({ id: 1, title: 'A New Hope' } as any), // Film de la API
      ];

      // Comprobamos que el resultado es el esperado
      expect(result.films).toEqual(expectedResult);
    });
  });
});
