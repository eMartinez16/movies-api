import { ApiProperty } from "@nestjs/swagger";

export class FilmResponseDto {
  @ApiProperty({ description: 'Film ID', example: 1})
  id: number;

  @ApiProperty({ description: 'Producer of the film', example: "Bonnie Arnold"})
  producer: string;

  @ApiProperty({ description: 'Title of the film', example: "Toy story updated" })
  title: string;

  @ApiProperty({ description: 'Episode ID of the film', example: 3})
  episodeId: number;

  @ApiProperty({ description: 'Director of the film', example:  "John Lasseter" })
  director: string;

  @ApiProperty({ description: 'Release date of the film', example: "1995-11-19T00:00:00.000Z"})
  releaseDate: Date;

  @ApiProperty({ description: 'Opening crawl of the film', example: "The adventures of Woody, a pull-string cowboy toy, and his friends in Andy’s room"})
  openingCrawl: string;
}