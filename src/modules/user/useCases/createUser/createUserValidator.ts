import { Result } from '../../../../shared/core/Result';
import { EmailValidator } from '../../../../shared/logic/validators/EmailValidator';
import { RequiredLengthValidator } from '../../../../shared/logic/validators/RequiredLengthValidator';
import { ValidatorComposite } from '../../../../shared/logic/validators/ValidatorComposite';
import { CreateUserUseCaseDTO } from './CreateUserUseCaseDTO';

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 40;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 80;

export const validateUserCreate = (dto: CreateUserUseCaseDTO): Result<CreateUserUseCaseDTO> => {
  const validations = new ValidatorComposite<CreateUserUseCaseDTO>();
  validations
    .add(new EmailValidator<CreateUserUseCaseDTO>('email'))
    .add(
      new RequiredLengthValidator<CreateUserUseCaseDTO>('password', {
        min: PASSWORD_MIN_LENGTH,
        max: PASSWORD_MAX_LENGTH,
      }),
    )
    .add(
      new RequiredLengthValidator<CreateUserUseCaseDTO>('username', {
        min: USERNAME_MIN_LENGTH,
        max: USERNAME_MAX_LENGTH,
      }),
    );

  return validations.validate(dto);
};
