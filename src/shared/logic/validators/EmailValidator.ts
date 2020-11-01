import { Result } from '../../core/Result';
import { invalidParamError } from '../Errors';
import { Validator } from './Validator';
import validator from 'validator';

type EmailField<T> = keyof T & string;

export class EmailValidator<T> implements Validator<T> {
  constructor(private readonly emailFieldName: EmailField<T>) {}

  validate(input: T): Result<T> {
    const email = input[this.emailFieldName];

    if (typeof email !== 'string') {
      return Result.fail<T>(invalidParamError('E-Mail'));
    }

    const isEmail = validator.isEmail(email);

    if (!isEmail) {
      return Result.fail<T>(invalidParamError('E-Mail'));
    }

    return Result.success<T>(input);
  }
}
