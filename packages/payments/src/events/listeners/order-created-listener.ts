import { Listener, OrderCreatedEvent, Subjects } from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = "payments-service";

  async onMessage(data: OrderCreatedEvent["data"], message: Message) {
    await Order.create({
      _id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
    });

    message.ack();
  }
}
