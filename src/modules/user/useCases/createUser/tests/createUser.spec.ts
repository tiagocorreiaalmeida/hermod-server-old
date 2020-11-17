import faker from 'faker';

import { CreateUserUseCase, EMAIL_EXISTS_ERROR, USERNAME_EXISTS_ERROR } from '../CreateUserUseCase';
import { CreateUserUseCaseDTO } from '../CreateUserUseCaseDTO';
import { FakeUserRepo } from '../../../repos/fakes/fakeUserRepo';
import { invalidLengthError, invalidParamError } from '../../../../../shared/logic/Errors';
import {
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
} from '../createUserValidator';

interface SutProps {
  sut: CreateUserUseCase;
  validDto: CreateUserUseCaseDTO;
  userRepo: FakeUserRepo;
}

const fakeUserRepo = new FakeUserRepo();
const validDto: CreateUserUseCaseDTO = {
  email: faker.internet.email(),
  password: '1'.repeat(MIN_PASSWORD_LENGTH),
  username: '1'.repeat(MIN_USERNAME_LENGTH),
};

const makeSut = (): SutProps => {
  const sut = new CreateUserUseCase(fakeUserRepo);

  return {
    sut,
    validDto,
    userRepo: fakeUserRepo,
  };
};

describe('Create User', () => {
  it('Should reject an invalid email', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute({
      ...validDto,
      email: 'fakeemail',
    });
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(invalidParamError('E-Mail'));
  });

  it('Should reject a smaller password than the required', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute({
      ...validDto,
      password: '1'.repeat(MIN_PASSWORD_LENGTH - 1),
    });
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(
      invalidLengthError('password', { min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH }),
    );
  });

  it('Should reject a bigger password than the allowed', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute({
      ...validDto,
      password: '1'.repeat(MAX_PASSWORD_LENGTH + 1),
    });
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(
      invalidLengthError('password', { min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH }),
    );
  });

  it('Should reject a smaller username than the required', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute({
      ...validDto,
      username: '1'.repeat(MIN_USERNAME_LENGTH - 1),
    });
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(
      invalidLengthError('username', { min: MIN_USERNAME_LENGTH, max: MAX_USERNAME_LENGTH }),
    );
  });

  it('Should reject a bigger username than the allowed', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute({
      ...validDto,
      username: '1'.repeat(MAX_USERNAME_LENGTH + 1),
    });
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(
      invalidLengthError('username', { min: MIN_USERNAME_LENGTH, max: MAX_USERNAME_LENGTH }),
    );
  });

  it('should create,persist and return a valid user', async () => {
    const { sut, validDto, userRepo } = makeSut();

    const result = await sut.execute(validDto);
    expect(result.isError).toBeFalsy();

    const response = result.getValue();
    expect(response.email).toEqual(validDto.email);
    expect(response.username).toEqual(validDto.username);
    expect(response.id).toBeDefined();

    const userExists = await userRepo.exists(response.id);
    expect(userExists).toBeTruthy();
  });

  it('should refuse a duplicated email', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute(validDto);
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(EMAIL_EXISTS_ERROR);
  });

  it('should refuse a duplicated username', async () => {
    const { sut, validDto } = makeSut();

    const result = await sut.execute({
      ...validDto,
      email: faker.internet.email(),
    });
    expect(result.isError).toBeTruthy();
    expect(result.getError()).toBe(USERNAME_EXISTS_ERROR);
  });
});
