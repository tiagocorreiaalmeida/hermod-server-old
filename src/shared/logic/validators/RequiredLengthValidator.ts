import validator from 'validator';
import { Result } from '../../core/Result';
import { invalidLengthError } from '../Errors';
import { Validator } from './Validator';

interface FieldLengthOptions {
  min: number;
  max: number;
}

export class RequiredLengthValidator<T> implements Validator<T> {
  constructor(
    private readonly fieldName: keyof T,
    private readonly fieldLengthOptions?: FieldLengthOptions,
  ) {}

  validate(input: T): Result<T> {
    const min = this.fieldLengthOptions?.min ?? 1;
    const max = this.fieldLengthOptions?.max;

    const field = input[this.fieldName];
    const isValid = validator.isLength(`${field}`, { min, max });

    if (isValid) {
      return Result.fail<T>(invalidLengthError(`${this.fieldName}`, { min, max }));
    }

    return Result.success<T>(input);
  }
}
