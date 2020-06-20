import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  OrderStatus,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName: string = "orders-service";

  async onMessage(data: PaymentCreatedEvent["data"], message: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error(`Order ${data.orderId} could not be found.`);
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    // We should publish a Order Updated event and listen in the appropriate microservices

    message.ack();
  }
}
