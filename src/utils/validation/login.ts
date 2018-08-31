import Validator from 'validator';

export function validateLoginInput(input: any) {
  const { email = '', password = '' } = input;
  const errors: any = {};

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  return {
    errors: Object.keys(errors).length ? errors : undefined
  };
}
