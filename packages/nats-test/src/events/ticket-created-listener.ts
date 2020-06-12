import { Listener } from "@ticketing/backend-core/src/events/base-listener";
import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@ticketing/backend-core/src/events/ticket-created-event";
import { Subjects } from "@ticketing/backend-core/src/events/subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], message: Message): void {
    console.log({
      eventData: data,
    });
    message.ack();
  }
}
