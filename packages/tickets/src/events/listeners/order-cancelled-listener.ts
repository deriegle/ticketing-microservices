import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = "tickets-service";

  async onMessage(
    data: OrderCancelledEvent["data"],
    message: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error(`Ticket with id ${data.ticket.id} not found`);
    }

    ticket.set({
      orderId: undefined,
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
