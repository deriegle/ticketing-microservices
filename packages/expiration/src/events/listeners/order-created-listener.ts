import {
  Listener,
  OrderCreatedEvent,
  Subjects,
  OrderStatus,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName: string = "expiration-service";

  onMessage(data: OrderCreatedEvent["data"], message: Message): void {
    throw new Error("Method not implemented.");
  }
}
