import { Listener, OrderCreatedEvent, Subjects } from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = "expiration-service";

  async onMessage(
    data: OrderCreatedEvent["data"],
    message: Message
  ): Promise<void> {
    await expirationQueue.add({
      orderId: data.id,
    });

    message.ack();
  }
}
