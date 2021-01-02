import joi from 'joi';
import { toErrorBody } from './toErrorBody';

export function validateLoginInput(input: any) {
  const loginInputSchema = {
    email: joi.string().email(),
    password: joi.string().min(6).max(30),
  };

  const { error } = joi.validate(input, loginInputSchema, {
    abortEarly: false,
    presence: 'required',
  });

  return {
    errors: error ? toErrorBody(error) : undefined,
  };
}
