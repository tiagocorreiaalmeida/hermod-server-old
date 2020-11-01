import { Result } from '../../core/Result';
import { Validator } from './Validator';

export class ValidatorComposite<T> implements Validator<T> {
  constructor(private readonly validators: Validator<T>[]) {}

  validate(input: T): Result<T> {
    for (const validator of this.validators) {
      const error = validator.validate(input);

      if (error.isError) {
        return Result.fail<T>(error.getError());
      }
    }

    return Result.success<T>(input);
  }
}
