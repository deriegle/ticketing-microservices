import { Listener, Subjects, OrderCreatedEvent } from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { Ticket } from "@ticketing/tickets/src/models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = "tickets-service";

  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error(`Ticket with id ${data.ticket.id} not found`);
    }

    ticket.set({
      orderId: data.id,
    });

    await ticket.save();

    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version!,
      orderId: ticket.orderId,
    });

    message.ack();
  }
}
