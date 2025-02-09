import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Role } from '../core/enum/role.enum';
import { Roles } from '../core/decorators/role.decorator';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiCommonResponses } from '../core/decorators/api.responses.decorator';
import { FilmResponseDto } from './responses/film.response.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/core/guards/roles.guard';


@ApiTags('Films') 
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiResponse({
    status: 200,
    description: 'List of films from API and DB.',
    type: [FilmResponseDto],
    schema: {
      example: {
        films: [
          {
            id: 1,
            title: 'A New Hope',
            producer: 'Gary Kurtz, Rick McCallum',
            episode_id: 4,
            director: 'George Lucas',
            releaseDate: '1977-05-25',
            openingCrawl: 'It is a period of civil war... Rebel spaceships...'
          },
          {
            id: 2,
            title: 'The Empire Strikes Back',
            producer: 'Gary Kurtz, Rick McCallum',
            episode_id: 5,
            director: 'Irvin Kershner',
            releaseDate: '1980-05-17',
            openingCrawl: 'It is a dark time for the Rebellion...'
          },
        ],
      },
    },
  })
  @Get()
  @ApiOperation({ summary: 'Get all films (from api and db)' })
  @ApiCommonResponses()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getAllFilms() {
    return await this.filmsService.getAllFilms();
  }


  @Get('/sync')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN_USER)
  @ApiOperation({ summary: 'Synchronize films from API and DB' })
  @ApiCommonResponses()
  @ApiBearerAuth()
  async syncFilms() {
    return await this.filmsService.syncFilms();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Film detail',
    type: [FilmResponseDto],
    schema: {
      example: {      
        id: 1,
        title: 'A New Hope',
        producer: 'Gary Kurtz, Rick McCallum',
        episode_id: 4,
        director: 'George Lucas',
        releaseDate: '1977-05-25',
        openingCrawl: 'It is a period of civil war... Rebel spaceships...'  
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Film not found',  
  })
  @ApiOperation({ summary: 'Get film by id' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(Role.DEFAULT_USER)
  @ApiParam({ name: 'id', description: 'film id', type: 'number' })
  @ApiCommonResponses()
  async getFilmById(@Param('id', ParseIntPipe) id: number) {
    return await this.filmsService.getFilmById(id);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(Role.ADMIN_USER)
  @ApiOperation({ summary: 'Create new film' })
  @ApiBody({ description: 'Film information', type: CreateFilmDto })
  @ApiCommonResponses()
  @ApiResponse({
    status: 200,
    description: 'Film created successful.',
    schema: {
      example: {
        message: "Film created successfully",
      },
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async createFilm(@Body() dto: CreateFilmDto) {
    return await this.filmsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(Role.ADMIN_USER)
  @ApiOperation({ summary: 'Update film information' })
  @ApiParam({ name: 'id', description: 'film id', type: 'number' })
  @ApiCommonResponses()
  @ApiBody({
    description: 'Film data to update',
    type: UpdateFilmDto,   
  })
  @ApiResponse({
    status: 200,
    description: 'Film updated successfully.',
    type: FilmResponseDto
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async updateFilm(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateFilmDto) {
    return await this.filmsService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(Role.ADMIN_USER)
  @ApiOperation({ summary: 'Delete film' })
  @ApiParam({ name: 'id', description: 'film id', type: 'number' })
  @ApiCommonResponses()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async deleteFilm(@Param('id', ParseIntPipe) id: number) {
    return await this.filmsService.delete(id);
  }

}
