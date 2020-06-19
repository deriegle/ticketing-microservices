import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderStatus, OrderCreatedEvent } from "@ticketing/backend-core";
import { OrderCreatedListener } from "../order-created-listener";
import { Order } from "../../../models/order";

const setup = async (): Promise<{
  listener: OrderCreatedListener;
  data: OrderCreatedEvent["data"];
  message: Message;
}> => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      price: 50,
      id: new mongoose.Types.ObjectId().toHexString(),
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

describe("OrderCreatedListener", () => {
  it("updates the order status to cancelled", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);

    expect(order).toBeDefined();
    expect(order!.userId).toBe(data.userId);
    expect(order!.price).toBe(data.ticket.price);
    expect(order!.status).toBe(OrderStatus.Created);
    expect(order!.version).toBe(0);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
