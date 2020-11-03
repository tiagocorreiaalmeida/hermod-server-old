import faker from 'faker';

import { User } from '../../../domain/User';
import { PASSWORD_MIN_LENGTH } from '../../createUser/createUserValidator';
import { LoginUseCase } from '../login';
import { FakeUserRepo } from '../../../repos/fakes/fakeUserRepo';
import { authService } from '../../../services/auth';
import { passwordService } from '../../../services/password';

import { AUTHENTICATION_FAILED } from '../loginErrors';
import { UniqueEntityID } from '../../../../../shared/core/UniqueEntityID';

const generateUserCreateProps = () => {
  const password = 'a'.repeat(PASSWORD_MIN_LENGTH);

  return {
    id: new UniqueEntityID().toString(),
    email: faker.internet.email(),
    password: passwordService.hash(password),
    plainTextPassword: password,
    username: faker.internet.userName(),
  };
};

describe('Login', () => {
  const userRepo = new FakeUserRepo();
  const verifiedUser = generateUserCreateProps();
  const nonVerifiedUser = generateUserCreateProps();
  const loginUseCase = new LoginUseCase(userRepo, authService, passwordService);

  beforeAll(async () => {
    await userRepo.save(verifiedUser);
    await userRepo.save(nonVerifiedUser);
  });

  it('should refuse an invalid email', async () => {
    const loginResponse = await loginUseCase.execute({
      email: 'fakeemail',
      password: verifiedUser.plainTextPassword,
    });

    expect(loginResponse.isError).toBeTruthy();
  });

  it('should refuse an invalid password', async () => {
    const loginResponse = await loginUseCase.execute({
      email: verifiedUser.email,
      password: '',
    });

    expect(loginResponse.isError).toBeTruthy();
  });

  it('should refuse a non existent user', async () => {
    const loginResponse = await loginUseCase.execute({
      email: faker.internet.email(),
      password: 'a'.repeat(PASSWORD_MIN_LENGTH),
    });

    expect(loginResponse.isError).toBeTruthy();
    expect(loginResponse.getError()).toEqual(AUTHENTICATION_FAILED);
  });

  it('should refuse invalid credentials', async () => {
    const loginResponse = await loginUseCase.execute({
      email: verifiedUser.email,
      password: 'b'.repeat(PASSWORD_MIN_LENGTH),
    });

    expect(loginResponse.isError).toBeTruthy();
    expect(loginResponse.getError()).toEqual(AUTHENTICATION_FAILED);
  });

  it('should return a valid loginDTOResponse', async () => {
    const loginResponse = await loginUseCase.execute({
      email: verifiedUser.email,
      password: verifiedUser.plainTextPassword,
    });

    expect(loginResponse.isError).toBeFalsy();

    const data = loginResponse.getValue();
    const userId = verifiedUser.id;

    expect(data.accessToken).toBeDefined();
    const decodedAccessToken = await authService.decodeAccessToken(data.accessToken);
    expect(decodedAccessToken.userId).toEqual(userId);

    expect(data.refreshToken).toBeDefined();
    const decodedRefreshToken = await authService.decodeRefreshToken(data.refreshToken);
    expect(decodedRefreshToken.userId).toEqual(userId);

    expect(data.user.email).toEqual(verifiedUser.email);
    expect(data.user.id).toEqual(userId);
  });
});
