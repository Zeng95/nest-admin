import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: (request) => {
        if (!request || !request.cookies) return null;
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
