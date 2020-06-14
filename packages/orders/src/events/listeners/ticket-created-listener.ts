import {
  Listener,
  TicketCreatedEvent,
  Subjects,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = "orders-service";

  async onMessage(
    data: TicketCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const { id, title, price } = data;

    await Ticket.create({
      _id: id,
      title,
      price,
    });

    message.ack();
  }
}
