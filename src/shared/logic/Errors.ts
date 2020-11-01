export const missingParamError = (paramName: string): string => `Missing param: ${paramName}`;

export const invalidParamError = (paramName: string): string => `Invalid param: ${paramName}`;

export const invalidLengthError = (
  paramName: string,
  { min, max }: { min: number; max?: number },
): string =>
  max
    ? `${paramName} should be between ${min} and ${max} characters.`
    : `${paramName} should be at least ${min} characters long.`;
