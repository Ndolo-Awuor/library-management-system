import { Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CatalogQueryDto } from './dto/catalog-query.dto';
@Controller('books')
export class BooksController {
 constructor(private service:BooksService) {}
 @Get() findAll(@Query() q:CatalogQueryDto) {return this.service.findAll(q);}
 @Get(':id') findOne(@Param('id',ParseIntPipe) id:number) {return this.service.findOne(id);}
 @Post() @UseGuards(JwtAuthGuard,RolesGuard) @Roles('LIBRARIAN') create(@Body() dto:CreateBookDto) {return this.service.create(dto);}
 @Patch(':id') @UseGuards(JwtAuthGuard,RolesGuard) @Roles('LIBRARIAN') update(@Param('id',ParseIntPipe) id:number,@Body() dto:UpdateBookDto) {return this.service.update(id,dto);}
 @Delete(':id') @UseGuards(JwtAuthGuard,RolesGuard) @Roles('LIBRARIAN') remove(@Param('id',ParseIntPipe) id:number) {return this.service.remove(id);}
}
