export interface JWTClaims {
  userId: string;
}

export type JWTToken = string;
export type JWTRefreshToken = string;

export interface AuthService {
  createAccessToken(props: JWTClaims): JWTToken;
  decodeAccessToken(token: string): Promise<JWTClaims>;
  createRefreshToken(props: JWTClaims): JWTRefreshToken;
  decodeRefreshToken(token: string): Promise<JWTClaims>;
}
