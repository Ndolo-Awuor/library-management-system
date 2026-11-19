import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
@Module({imports:[PrismaModule,AuthModule],controllers:[GenresController],providers:[GenresService]})
export class GenresModule {}
