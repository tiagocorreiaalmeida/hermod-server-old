import { Result } from '../../core/Result';
import { missingParamError } from '../Errors';
import { Validator } from './Validator';

export class RequiredFieldValidator<T> implements Validator<T> {
  constructor(private readonly fieldName: keyof T) {}

  validate(input: T): Result<T> {
    if (!input[this.fieldName]) {
      return Result.fail<T>(missingParamError(this.fieldName.toString()));
    }

    return Result.success<T>(input);
  }
}
