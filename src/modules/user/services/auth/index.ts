export * from './authService';
import { LocalAuthProvider } from './localAuthProvider';

export const authService = new LocalAuthProvider();
