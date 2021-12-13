import { Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register/email')
  @HttpCode(200)
  async registerWithEmail(@Req() request: RegisterDto) {
    return this.authService.registerWithEmail(request);
  }

  @Post('auth/login/email')
  async loginWithEmail(@Req() request: RegisterDto) {
    return this.authService.loginWithEmail(request.email, request.password);
  }

  @Get('auth/logout')
  async logout(@Res() response: Response) {
    this.authService.logout(response);
  }
}
