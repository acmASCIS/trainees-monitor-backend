export interface IRead<T> {
  findAll(): Promise<T[]>;
  find(item: any): Promise<T[]>;
  findById(id: string): Promise<T | undefined>;
}
