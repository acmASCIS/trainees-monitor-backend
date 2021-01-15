export class Ticket {
  constructor(
    public title: string,
    public from: string,
    public to: string,
    public created_at: Date,
    public messages: string[]
  ) {}

  //   public async hashPassword(): Promise<string> {
  //     return await hash(this.password);
  //   }

  //   public async validatePassword(plainPassword: string) {
  //     return await compare(plainPassword, this.password);
  //   }

  //   public generateAuthToken(): string {
  //     return jwt.sign(
  //       { _id: this._id, handle: this.handle, name: this.name, role: this.role },
  //       process.env.JWT_SECRET as string,
  //       { expiresIn: process.env.JWT_EXPIRY }
  //     );
  //   }
}
