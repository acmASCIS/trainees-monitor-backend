export class ApiError extends Error {
  constructor(message?: string, public status: number = 500, public body?: object) {
    super(message || 'Internal Server Error.');
    this.name = this.constructor.name;
  }
}
