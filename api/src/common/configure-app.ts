import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from './prisma.filter';
export function configureApp(app:INestApplication) {
 app.enableCors({origin:process.env.CORS_ORIGIN || 'http://localhost:5173'});
 app.useGlobalPipes(new ValidationPipe({whitelist:true,forbidNonWhitelisted:true,transform:true}));
 app.useGlobalFilters(new PrismaFilter());
}
