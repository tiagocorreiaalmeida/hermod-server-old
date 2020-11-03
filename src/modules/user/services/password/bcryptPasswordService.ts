import bcrypt from 'bcrypt';

import { PasswordService } from './passwordService';

export class BcryptPasswordService implements PasswordService {
  hash(plainTextPassword: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainTextPassword, salt);
  }
  compare(plainTextPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainTextPassword, hashedPassword);
  }
}
