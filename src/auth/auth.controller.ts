import { Body, Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { EmailRegistrationDTO, PhoneRegistrationDTO } from './models/registration.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register/phone')
  @HttpCode(200)
  async registerWithPhone(@Body() body: PhoneRegistrationDTO, @Res() response: Response) {
    try {
      const user = await this.authService.registerWithPhone(body);
      response.json(user);
    } catch (e) {
      response.status(422).send(e);
    }
  }

  @Post('auth/register/email')
  @HttpCode(200)
  async registerWithEmail(@Body() body: EmailRegistrationDTO, @Res() response: Response) {
    try {
      const user = await this.authService.registerWithEmail(body);
      response.json(user);
    } catch (e) {
      response.status(422).send(e);
    }
  }

  @Post('auth/login')
  @HttpCode(200)
  async loginWithEmailOrPhone(@Body() body: EmailRegistrationDTO) {
    return this.authService.loginWithEmailOrPhone(body);
  }

  @Post('auth/forgot')
  @HttpCode(200)
  async forgotEmailOrPhone(@Body('username') body: string, @Res() response: Response) {
    console.log(body, response);
  }

  @Get('auth/logout')
  @HttpCode(200)
  async logout(@Res() response: Response) {
    this.authService.logout(response);
  }
}
