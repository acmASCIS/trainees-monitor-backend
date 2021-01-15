export interface TicketDTO {
  _id: string;
  title: string;
  messages: string[];
  from: string;
  to: string;
  created_at: Date;
}
