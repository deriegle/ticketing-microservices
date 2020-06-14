import { Subjects } from "@ticketing/backend-core/src/events/subjects";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    userId: string;
    title: string;
    price: number;
    version: number;
  };
}
