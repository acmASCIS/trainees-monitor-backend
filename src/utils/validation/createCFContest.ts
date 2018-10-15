import joi from 'joi';
import { toErrorBody } from './toErrorBody';

export function validateCreateContestInput(input: any) {
  const createInputSchema = {
    contestId: joi.number()
  };

  const { error } = joi.validate(input, createInputSchema, {
    abortEarly: false,
    presence: 'required'
  });

  return {
    errors: error ? toErrorBody(error) : undefined
  };
}
