import { Result } from '../../core/Result';
import { Validator } from './Validator';

export class ValidatorComposite<T> implements Validator<T> {
  private readonly validators: Validator<T>[] = [];

  add(validator: Validator<T>): ValidatorComposite<T> {
    this.validators.push(validator);

    return this;
  }

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
