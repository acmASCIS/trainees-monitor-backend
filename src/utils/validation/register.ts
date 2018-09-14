import joi from 'joi';
import { Role } from './../../models/User/UserDTO';
import { toErrorBody } from './toErrorBody';

export function validateRegisterInput(input: any) {
  const registerInputSchema = {
    handle: joi.string().token(),
    name: joi
      .string()
      .min(3)
      .max(30),
    email: joi.string().email(),
    password: joi
      .string()
      .min(6)
      .max(30),
    confirmPassword: joi
      .string()
      .valid(joi.ref('password'))
      .options({ language: { any: { allowOnly: 'must match password' } } }),
    role: joi
      .number()
      .min(Role.Trainee)
      .max(Role.Mentor),
    codeforcesHandle: joi
      .string()
      .min(3)
      .max(30)
  };

  const { error } = joi.validate(input, registerInputSchema, {
    abortEarly: false,
    presence: 'required'
  });

  return {
    errors: error ? toErrorBody(error) : undefined
  };
}
