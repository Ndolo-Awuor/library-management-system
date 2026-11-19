import { Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GenresService } from './genres.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
@Controller('genres')
export class GenresController {
 constructor(private service:GenresService) {}
 @Get() findAll() {return this.service.findAll();}
 @Get(':id') findOne(@Param('id',ParseIntPipe) id:number) {return this.service.findOne(id);}
 @Post() @UseGuards(JwtAuthGuard,RolesGuard) @Roles('LIBRARIAN') create(@Body() dto:CreateGenreDto) {return this.service.create(dto);}
 @Patch(':id') @UseGuards(JwtAuthGuard,RolesGuard) @Roles('LIBRARIAN') update(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdateGenreDto) {return this.service.update(id,dto);}
 @Delete(':id') @UseGuards(JwtAuthGuard,RolesGuard) @Roles('LIBRARIAN') remove(@Param('id',ParseIntPipe) id:number) {return this.service.remove(id);}
}
