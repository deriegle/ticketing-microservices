import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "@ticketing/orders/src/nats-wrapper";
import {
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@ticketing/backend-core";
import { Ticket } from "@ticketing/orders/src/models/ticket";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "@ticketing/orders/src/models/order";

const setup = async (): Promise<{
  listener: ExpirationCompleteListener;
  data: ExpirationCompleteEvent["data"];
  message: Message;
}> => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = await Ticket.create({
    title: "Dermot Kennedy",
    price: 54,
  });

  const order = await Order.create({
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

describe("ExpirationCompleteListener", () => {
  it("updates the order status to cancelled", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.orderId).populate("ticket");

    expect(updatedOrder).toBeDefined();
    expect(updatedOrder!.status).toBe(OrderStatus.Cancelled);
  });

  it("publishes a order cancelled event", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subjects.OrderCancelled,
      expect.any(String),
      expect.any(Function)
    );
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("acks the message but doesn't update the order status when it's already complete", async () => {
    const { listener, data, message } = await setup();

    await Order.updateOne(
      {
        _id: data.orderId,
      },
      {
        status: OrderStatus.Complete,
      }
    );

    await listener.onMessage(data, message);

    const order = await Order.findById(data.orderId);

    expect(order).toBeDefined();
    expect(order!.status).toBe(OrderStatus.Complete);
    expect(message.ack).toHaveBeenCalled();
  });
});
