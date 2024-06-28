export interface AuthenResDto {
  // 'expiresIn' in numeric value is interpreted as secondes count
  // (but string value "3600" will mean millisecond)
  expiresIn: number;
  token: string;
}
