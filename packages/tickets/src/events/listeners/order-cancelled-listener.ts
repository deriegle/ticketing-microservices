import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName: string = "tickets-service";

  onMessage(data: OrderCancelledEvent["data"], message: Message): void {
    throw new Error("Method not implemented.");
  }
}
