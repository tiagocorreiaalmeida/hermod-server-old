export * from './passwordService';
import { BcryptPasswordService } from './bcryptPasswordService';

export const authService = new BcryptPasswordService();
