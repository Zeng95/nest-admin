import { Body, Controller, Get, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register/phone')
  @HttpCode(200)
  async registerWithPhone(@Req() request: RegisterDto) {
    return this.authService.registerWithPhone(request);
  }

  @Post('auth/register/email')
  @HttpCode(200)
  async registerWithEmail(@Req() request: RegisterDto) {
    return this.authService.registerWithEmail(request);
  }

  @Post('auth/login')
  @HttpCode(200)
  async loginWithEmailOrPhone(@Req() request: RegisterDto, @Res() response: Response) {
    return this.authService.loginWithEmailOrPhone(request.email, request.password, response);
  }

  @Post('auth/forgot')
  @HttpCode(200)
  async emailOrPhoneForgot(@Body('username') body: string, @Res() response: Response) {
    console.log(body, response);
  }

  @Get('auth/logout')
  @HttpCode(200)
  async logout(@Res() response: Response) {
    this.authService.logout(response);
  }
}
