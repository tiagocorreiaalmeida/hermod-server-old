export interface PasswordService {
  hash(plainTextPassword: string): string;
  compare(plainTextPassword: string, hashedPassword: string): boolean;
}
