import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialsDto } from './dto/credentials.dto';
export const safeUser={id:true,email:true,role:true} as const;
@Injectable()
export class AuthService {
 constructor(private prisma:PrismaService,private jwt:JwtService) {}
 async register(dto:CredentialsDto) {
  const user=await this.prisma.user.create({data:{email:dto.email.trim().toLowerCase(),password:await bcrypt.hash(dto.password,12),role:'PATRON'},select:safeUser});
  return this.issue(user);
 }
 async login(dto:CredentialsDto) {
  const user=await this.prisma.user.findUnique({where:{email:dto.email.trim().toLowerCase()}});
  if(!user || !await bcrypt.compare(dto.password,user.password)) throw new UnauthorizedException('Invalid credentials');
  return this.issue(user);
 }
 private issue(u:{id:number,email:string,role:string}) {return {access_token:this.jwt.sign({sub:u.id}),user:{id:u.id,email:u.email,role:u.role}};}
}
