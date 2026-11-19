import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  Throttle,
  ThrottlerGuard,
} from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: CredentialsDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({
    default: {
      limit: 5,
      ttl: 60_000,
    },
  })
  login(@Body() dto: CredentialsDto) {
    return this.auth.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(
    @Req()
    req: {
      user: {
        id: number;
        email: string;
        role: string;
      };
    },
  ) {
    return req.user;
  }
}