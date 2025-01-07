import { PartialType } from '@nestjs/mapped-types';
import { CreateFilmDto } from './create-film.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateFilmDto extends PartialType(CreateFilmDto) {
   
    @ApiProperty({ example: 'Toy story', description: 'Film title' })
    title?: string;

    @ApiProperty({ example: 'Bonnie Arnold', description: 'Director of film' })
    producer?: string;

    @ApiProperty({ example: 'John Lasseter', description: 'Producer of film' })
    director?: string;

  
    @ApiProperty({ example: 'The adventures of Woody, a pull-string cowboy toy, and his friends in Andy’s room', description: 'The opening text crawl for the film' })
    openingCrawl?: string;

  
    @ApiProperty({ example: '3', description: 'Id of episode' })
    episodeId?: number;

    
    @Transform(({ value }) => new Date(value))
    @ApiProperty({   example: '1995-11-19T00:00:00.000Z',  description: 'The release date of the film' })
    releaseDate?: Date;
}