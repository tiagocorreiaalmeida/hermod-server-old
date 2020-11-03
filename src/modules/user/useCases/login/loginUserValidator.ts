import { Result } from '../../../../shared/core/Result';
import { EmailValidator } from '../../../../shared/logic/validators/EmailValidator';
import { RequiredLengthValidator } from '../../../../shared/logic/validators/RequiredLengthValidator';
import { ValidatorComposite } from '../../../../shared/logic/validators/ValidatorComposite';
import { LoginDTO } from './loginDTO';

export const validateUserLogin = (dto: LoginDTO): Result<LoginDTO> => {
  const validations = new ValidatorComposite<LoginDTO>();
  validations.add(new EmailValidator<LoginDTO>('email')).add(
    new RequiredLengthValidator<LoginDTO>('password', {
      min: 1,
    }),
  );

  return validations.validate(dto);
};
