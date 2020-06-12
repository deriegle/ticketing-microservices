import { Subjects } from "@ticketing/backend-core/src/events/subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    userId: string;
    title: string;
    price: number;
  };
}
