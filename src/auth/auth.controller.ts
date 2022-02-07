import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReqUser } from 'src/shared/user.decorator';
import { User } from 'src/users/models/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { EmailRegistrationDTO, PhoneRegistrationDTO } from './models/registration.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/phone')
  @HttpCode(200)
  async registerWithPhone(@Body() body: PhoneRegistrationDTO) {
    const result = await this.authService.registerWithPhone(body);
    // * Removie Object Properties with Destructuring
    const { password, ...newUser } = result;
    return newUser;
  }

  @Post('register/email')
  @HttpCode(200)
  async registerWithEmail(@Body() body: EmailRegistrationDTO) {
    const result = await this.authService.registerWithEmail(body);
    const { password, ...newUser } = result;
    return newUser;
  }

  // * Passport provides a strategy called passport-local that implements a username/password authentication mechanism
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async loginWithEmailOrPhone(
    @ReqUser() user: User,
    @Res({ passthrough: true }) response: Response,
    @Body() body: Body
  ) {
    const access_token = this.authService.login(user);
    if (body['remember_me']) {
      console.log(body);
    }
    // * Attach a cookie to an outgoing response is mores secure
    response.cookie('access_token', access_token, { httpOnly: true }).send({ success: true });
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
