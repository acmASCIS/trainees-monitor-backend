import bcrypt from 'bcrypt';

export async function hash(data: any): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(data, salt);
}

export async function compare(data: any, encrypted: string): Promise<boolean> {
  return await bcrypt.compare(data, encrypted);
}
