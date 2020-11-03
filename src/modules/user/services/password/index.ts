export * from './passwordService';
import { BcryptPasswordService } from './bcryptPasswordService';

export const passwordService = new BcryptPasswordService();
