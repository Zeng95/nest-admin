import { Body, Controller, Get, HttpCode, Post, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { EmailRegistrationDTO, PhoneRegistrationDTO } from './models/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/phone')
  @HttpCode(200)
  async registerWithPhone(@Body() body: PhoneRegistrationDTO, @Res() response: Response) {
    const result = await this.authService.registerWithPhone(body);
    // Removie Object Properties with Destructuring
    const { password, ...user } = result;
    response.json(user);
  }

  @Post('register/email')
  @HttpCode(200)
  async registerWithEmail(@Body() body: EmailRegistrationDTO, @Res() response: Response) {
    const result = await this.authService.registerWithEmail(body);
    // Removie Object Properties with Destructuring
    const { password, ...user } = result;
    response.json(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async loginWithEmailOrPhone(@Request() req, @Body() body: Body) {
    console.log(req, body);
  }

  @Post('forgot')
  @HttpCode(200)
  async forgotEmailOrPhone(@Body('username') body: string, @Res() response: Response) {
    console.log(body, response);
  }

  @Get('logout')
  @HttpCode(200)
  async logout(@Res() response: Response) {
    this.authService.logout(response);
  }
}
