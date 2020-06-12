import { BasePublisher } from "@ticketing/backend-core/src/events/base-publisher";
import { TicketCreatedEvent } from "@ticketing/backend-core/src/events/ticket-created-event";
import { Subjects } from "@ticketing/backend-core/src/events/subjects";

export class TicketCreatedPublisher extends BasePublisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
