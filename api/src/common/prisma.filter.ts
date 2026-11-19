import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaFilter implements ExceptionFilter {
 catch(e:Prisma.PrismaClientKnownRequestError,host:ArgumentsHost) {
  const status=e.code==='P2025'?404:['P2002','P2003','P2034'].includes(e.code)?409:500;
  host.switchToHttp().getResponse().status(status).json({statusCode:status,message:status===404?'Resource not found':status===409?'Conflict: duplicate, referenced resource or concurrent update':'Database operation failed'});
 }
}
