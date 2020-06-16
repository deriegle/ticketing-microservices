import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket, TicketDocument } from "../../../models/ticket";

const setup = async (): Promise<{
  listener: OrderCreatedListener;
  data: OrderCreatedEvent["data"];
  ticket: TicketDocument;
  message: Message;
}> => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = await Ticket.create({
    price: 23.54,
    title: "Dermot Kennedy",
    userId: "1234",
  });

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: "2939329",
    version: 0,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message };
};

describe("OrderCreatedListener", () => {
  it("sets the orderId of the ticket", async () => {
    const { listener, message, data, ticket } = await setup();

    expect(ticket.orderId).toBeUndefined();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(ticket).toBeDefined();
    expect(updatedTicket!.orderId).toBe(data.id);
  });

  it("acks the message", async () => {
    const { listener, message, data } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
