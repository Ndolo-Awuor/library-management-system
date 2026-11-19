import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CatalogQueryDto } from './dto/catalog-query.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
@Injectable()
export class BooksService {
 constructor(private prisma:PrismaService) {}
 findAll(q:CatalogQueryDto) {
  return this.prisma.book.findMany({where:{...(q.genreId && {genreId:q.genreId}),...(q.search && {OR:[{title:{contains:q.search,mode:'insensitive' as const}},{author:{contains:q.search,mode:'insensitive' as const}}]})},include:{genre:true},orderBy:{id:'asc'},skip:(q.page-1)*q.limit,take:q.limit});
 }
 async findOne(id:number) {const b=await this.prisma.book.findUnique({where:{id},include:{genre:true}});if(!b)throw new NotFoundException('Book not found');return b;}
 create(dto:CreateBookDto) {return this.prisma.book.create({data:{...dto,availableCopies:dto.totalCopies},include:{genre:true}});}
 update(id:number,dto:UpdateBookDto) {return this.prisma.book.update({where:{id},data:dto,include:{genre:true}});}
 remove(id:number) {return this.prisma.book.delete({where:{id},include:{genre:true}});}
}
