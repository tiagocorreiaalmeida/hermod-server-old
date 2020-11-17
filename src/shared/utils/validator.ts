import externalValidator from 'validator';

type isLengthArgs = { value: string; min?: number; max?: number };

interface Validator {
  isEmail(email: string): boolean;
  isLength(args: isLengthArgs): boolean;
}

export const validator: Validator = {
  isEmail(email: string) {
    return externalValidator.isEmail(email);
  },
  isLength({ value, min, max }: isLengthArgs) {
    return externalValidator.isLength(value, { min, max });
  },
};
