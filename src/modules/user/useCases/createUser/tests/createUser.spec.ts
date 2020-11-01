import { CreateUserUseCase } from '../CreateUserUseCase';
import { Validator } from '../../../../../shared/logic/validators/Validator';
import { ValidatorComposite } from '../../../../../shared/logic/validators/ValidatorComposite';
import { EmailValidator } from '../../../../../shared/logic/validators/EmailValidator';
import { CreateUserUseCaseDTO } from '../CreateUserUseCaseDTO';
import { FakeUserRepo } from '../../../repos/fakes/fakeUserRepo';
import { invalidLengthError, invalidParamError } from '../../../../../shared/logic/Errors';
import { RequiredLengthValidator } from '../../../../../shared/logic/validators/RequiredLengthValidator';

const makeValidators = () => {
  const validators: Validator<CreateUserUseCaseDTO>[] = [];

  const emailValidator = new EmailValidator<CreateUserUseCaseDTO>('email');
  const passwordValidator = new RequiredLengthValidator<CreateUserUseCaseDTO>('password', {
    min: 6,
  });

  validators.push(emailValidator);
  validators.push(passwordValidator);

  return new ValidatorComposite(validators);
};

interface SutProps {
  sut: CreateUserUseCase;
  validators: Validator<CreateUserUseCaseDTO>;
}

const makeSut = (): SutProps => {
  const validators = makeValidators();
  const fakeUserRepo = new FakeUserRepo();
  const sut = new CreateUserUseCase(validators, fakeUserRepo);

  return {
    validators,
    sut,
  };
};

describe('Create User', () => {
  it('Should reject an invalid email', async () => {
    const { sut } = makeSut();

    const invalidDTO: CreateUserUseCaseDTO = {
      email: 'random_string',
      name: 'your aunt name here',
      password: 'her_birthday_date_here',
    };

    const result = await sut.execute(invalidDTO);
    expect(result.isError).toBe(true);
    expect(result.getError()).toBe(invalidParamError('E-Mail'));
  });

  it('Should reject an invalid password', async () => {
    const { sut } = makeSut();

    const invalidDTO: CreateUserUseCaseDTO = {
      email: 'valid_mail@mail.com',
      name: 'your aunt name here',
      password: 'damn',
    };

    const result = await sut.execute(invalidDTO);
    expect(result.isError).toBe(true);
    expect(result.getError()).toBe(invalidLengthError('password', { min: 6 }));
  });
});
