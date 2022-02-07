import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (request: any) => {
        if (!request || !request.cookies['access_token']) {
          throw new UnauthorizedException('Miss an HTTP cookie');
        }
        return request.cookies['access_token'];
      },
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.name };
  }
}
