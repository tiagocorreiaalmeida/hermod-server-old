import jwt from 'jsonwebtoken';

import { AuthService, JWTClaims, JWTToken, JWTRefreshToken } from './authService';
import { env } from '../../../../config';

export class LocalAuthProvider implements AuthService {
  createAccessToken(props: JWTClaims): JWTToken {
    return jwt.sign(props, env.ACCESS_TOKEN_SECRET, { expiresIn: env.ACCESS_TOKEN_DURATION });
  }
  async decodeAccessToken(token: string): Promise<JWTClaims> {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET);
    return payload as JWTClaims;
  }
  createRefreshToken(props: JWTClaims): JWTRefreshToken {
    return jwt.sign(props, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_DURATION });
  }
  async decodeRefreshToken(token: string): Promise<JWTClaims> {
    const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET);
    return payload as JWTClaims;
  }
}
