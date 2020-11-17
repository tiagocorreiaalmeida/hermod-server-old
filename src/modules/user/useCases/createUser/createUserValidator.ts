import { Result } from '../../../../shared/core/Result';
import { EmailValidator } from '../../../../shared/logic/validators/EmailValidator';
import { RequiredLengthValidator } from '../../../../shared/logic/validators/RequiredLengthValidator';
import { ValidatorComposite } from '../../../../shared/logic/validators/ValidatorComposite';
import { CreateUserUseCaseDTO } from './CreateUserUseCaseDTO';

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 40;

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 80;

export const validateUserCreate = (dto: CreateUserUseCaseDTO): Result<CreateUserUseCaseDTO> => {
  const validations = new ValidatorComposite<CreateUserUseCaseDTO>();
  validations
    .add(new EmailValidator<CreateUserUseCaseDTO>('email'))
    .add(
      new RequiredLengthValidator<CreateUserUseCaseDTO>('password', {
        min: MIN_PASSWORD_LENGTH,
        max: MAX_PASSWORD_LENGTH,
      }),
    )
    .add(
      new RequiredLengthValidator<CreateUserUseCaseDTO>('username', {
        min: MIN_USERNAME_LENGTH,
        max: MAX_USERNAME_LENGTH,
      }),
    );

  return validations.validate(dto);
};
