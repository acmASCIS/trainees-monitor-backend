export class Ticket {
  constructor(
    public title: string,
    public from: string,
    public to: string,
    public created_at: Date,
    public messages: string[]
  ) {}
}
