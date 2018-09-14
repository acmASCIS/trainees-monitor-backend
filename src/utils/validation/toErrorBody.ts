import joi from 'joi';

export function toErrorBody(errors: joi.ValidationError): object {
  const errorBody: any = {};
  for (const error of errors.details) {
    errorBody[error.path[0]] = error.message;
  }

  return errorBody;
}
