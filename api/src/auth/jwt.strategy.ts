import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { safeUser } from './auth.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
 constructor(private prisma:PrismaService) {
  const secret=process.env.JWT_SECRET;
  if(!secret || secret.length<32 || secret.startsWith('replace_')) throw new Error('JWT_SECRET must be a private random secret of at least 32 characters');
  super({jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrKey:secret,ignoreExpiration:false,algorithms:['HS256']});
 }
 async validate(payload:{sub:number}) {
  if(!Number.isInteger(payload.sub) || payload.sub<1) throw new UnauthorizedException();
  const user=await this.prisma.user.findUnique({where:{id:payload.sub},select:safeUser});
  if(!user) throw new UnauthorizedException();
  return user; // Fresh DB role: never trust a stale role inside a token.
 }
}
