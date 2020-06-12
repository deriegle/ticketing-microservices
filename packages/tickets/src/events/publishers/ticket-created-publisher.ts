import {
  BasePublisher,
  TicketCreatedEvent,
  Subjects,
} from "@ticketing/backend-core";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
