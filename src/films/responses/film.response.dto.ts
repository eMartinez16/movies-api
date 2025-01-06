import { ApiProperty } from "@nestjs/swagger";

export class FilmResponseDto {
  @ApiProperty({ description: 'Film ID' })
  id: number;

  @ApiProperty({ description: 'Producer of the film' })
  producer: string;

  @ApiProperty({ description: 'Title of the film' })
  title: string;

  @ApiProperty({ description: 'Episode ID of the film' })
  episode_id: number;

  @ApiProperty({ description: 'Director of the film' })
  director: string;

  @ApiProperty({ description: 'Release date of the film' })
  releaseDate: Date;

  @ApiProperty({ description: 'Opening crawl of the film' })
  openingCrawl: string;
}