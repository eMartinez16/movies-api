import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNumber, IsString, MinLength } from "class-validator";

export class CreateFilmDto {

    @IsString()
    @Transform(({ value }) => value.trim())
    @MinLength(3)
    @ApiProperty({ example: 'Toy story', description: 'Film title' })
    title: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: 'Bonnie Arnold', description: 'Director of film' })
    producer: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: 'John Lasseter', description: 'Producer of film' })
    director: string;

    @IsString()
    @ApiProperty({ example: 'The adventures of Woody, a pull-string cowboy toy, and his friends in Andy’s room', description: 'The opening text crawl for the film' })
    openingCrawl: string;

    @IsNumber()
    @ApiProperty({ example: '34', description: 'Id of episode' })
    episodeId: number;

    @IsDate()
    @ApiProperty({ example: '19-11-1995', description: 'The release date of the film' })
    releaseDate: Date;

}
