import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName: string = "orders-service";

  async onMessage(
    data: TicketUpdatedEvent["data"],
    message: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({
      title: data.title,
      price: data.price,
    });

    await ticket.save();
    message.ack();
  }
}
