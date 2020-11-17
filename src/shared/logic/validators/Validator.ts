import { Result } from '../../core/Result';

export interface Validator<T> {
  validate: (input: T) => Result<T>;
}
