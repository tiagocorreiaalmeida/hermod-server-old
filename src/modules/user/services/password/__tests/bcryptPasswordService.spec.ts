import { BcryptPasswordService } from '../bcryptPasswordService';

describe('BcryptPasswordService', () => {
  const passwordService = new BcryptPasswordService();
  const password = '12345';

  it('should return a hashed version of the password', () => {
    const hashedPassword = passwordService.hash(password);
    const passwordsAreEqual = hashedPassword === password;

    expect(passwordsAreEqual).toBeFalsy();
  });

  it('should compare and return true if a plain text password has the same value as the hashed one', async () => {
    const hashedPassword = passwordService.hash(password);
    const passwordMatches = passwordService.compare(password, hashedPassword);

    expect(passwordMatches).toBeTruthy();
  });
});
