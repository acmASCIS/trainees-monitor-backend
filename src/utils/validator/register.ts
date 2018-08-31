import Validator from 'validator';
import { Role } from './../../models/User/UserDTO';

export function validateRegisterInput(input: any) {
  const {
    handle = '',
    name = '',
    email = '',
    password = '',
    confirmPassword = '',
    role = '',
    codeforcesHandle = ''
  } = input;
  const errors: any = {};

  if (Validator.isEmpty(handle)) {
    errors.handle = 'Handle field is required';
  }

  if (Validator.isEmpty(name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (!Validator.isLength(password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!Validator.equals(confirmPassword, password)) {
    errors.confirmPassword = 'Passwords must match';
  }

  if (role in Role === false) {
    errors.role = 'Invalid role';
  }

  if (Validator.isEmpty(codeforcesHandle)) {
    errors.codeforcesHandle = 'Codeforces handle is required';
  }

  return {
    errors: Object.keys(errors).length ? errors : undefined
  };
}
