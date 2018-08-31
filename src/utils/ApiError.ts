export class ApiError extends Error {
  constructor(message: string, public status: number = 500, public body?: object) {
    super(message);
  }
}
