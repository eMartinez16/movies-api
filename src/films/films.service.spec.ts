import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Film } from './entities/film.entity';
import { ConfigService } from '@nestjs/config';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { NotFoundException } from '@nestjs/common';

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
          useValue: { get: jest.fn().mockReturnValue(process.env.SW_API_ENDPOINT) },
        }
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    repository = module.get<Repository<Film>>(getRepositoryToken(Film));
  });

  describe('create', () => {
    it('should create a new film and return a success message', async () => {
      const createFilmDto: CreateFilmDto = {
        title: 'The Phantom Menace',
        producer: 'Lucasfilm',
        episodeId: 1,
        director: 'George Lucas',
        releaseDate: new Date('1999-05-19'),
        openingCrawl: 'A long time ago in a galaxy far, far away...',
      };

      jest.spyOn(repository, 'save').mockResolvedValueOnce(createFilmDto as any);

      const result = await service.create(createFilmDto);

      expect(result).toEqual({ message: 'Film created successfully' });
      expect(repository.save).toHaveBeenCalledWith(createFilmDto);
    });
  });

  describe('update', () => {
    it('should update a film and return the updated film', async () => {
      const updateFilmDto: UpdateFilmDto = {
        title: 'The Phantom Menace - Updated',
      };

      const existingFilm: Film = {
        id: 1,
        title: 'The Phantom Menace',
        producer: 'Lucasfilm',
        episodeId: 1,
        director: 'George Lucas',
        releaseDate: new Date('1999-05-19'),
        openingCrawl: 'A long time ago in a galaxy far, far away...',
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingFilm);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...existingFilm,
        ...updateFilmDto,
      });

      const result = await service.update(1, updateFilmDto);

      expect(result).toEqual({
        id: 1,
        title: 'The Phantom Menace - Updated',
        producer: 'Lucasfilm',
        episode_id: 1,
        director: 'George Lucas',
        releaseDate: new Date('1999-05-19'),
        openingCrawl: 'A long time ago in a galaxy far, far away...',
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingFilm,
        ...updateFilmDto,
      });
    });

    it('should throw NotFoundException if film does not exist', async () => {
      const updateFilmDto: UpdateFilmDto = { title: 'Non-existent Film' };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.update(999, updateFilmDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a film and return the result', async () => {
      const existingFilm: Film = {
        id: 1,
        title: 'The Phantom Menace',
        producer: 'Lucasfilm',
        episodeId: 1,
        director: 'George Lucas',
        releaseDate: new Date('1999-05-19'),
        openingCrawl: 'A long time ago in a galaxy far, far away...',
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingFilm);
      jest.spyOn(repository, 'softDelete').mockResolvedValueOnce({
        affected: 1,
        raw: [],     
        generatedMaps: [], 
      } as UpdateResult);

      const result = await service.delete(1);

      expect(result).toEqual({ affected: 1 });
      expect(repository.softDelete).toHaveBeenCalledWith(existingFilm.id);
    });

    it('should throw NotFoundException if film does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });
  });
});
