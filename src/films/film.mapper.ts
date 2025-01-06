
import { Film } from './entities/film.entity';
import { FilmResponseDto } from './responses/film.response.dto';

export class FilmMapper {
  static toDto(film: Film): FilmResponseDto {
    return {
      id: film.id,
      title: film.title,
      producer: film.producer,
      episode_id: film.episode_id,
      director: film.director,
      releaseDate: film.releaseDate,
      openingCrawl: film.openingCrawl,
    };
  }

  static toDtoArray(films: Film[]): FilmResponseDto[] {
    return films.map(film => this.toDto(film));
  }
}
