import {
  BasePublisher,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketing/backend-core";

export class TicketUpdatedPublisher extends BasePublisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
