export interface AuthenReq {
  email: string;
  password: string;
}

export interface AuthenRes {
  expiresIn: number;
  token: string;
}
