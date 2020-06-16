import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import {
  OrderCancelledEvent,
  Subjects,
  TicketUpdatedEvent,
} from "@ticketing/backend-core";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket, TicketDocument } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async (): Promise<{
  listener: OrderCancelledListener;
  data: OrderCancelledEvent["data"];
  ticket: TicketDocument;
  message: Message;
}> => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const ticket = await Ticket.create({
    price: 23.54,
    title: "Dermot Kennedy",
    userId: "1234",
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
    version: 1,
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, message };
};

describe("OrderCancelledListener", () => {
  it("sets the orderId of the ticket to undefined", async () => {
    const { listener, message, data, ticket } = await setup();

    expect(ticket.orderId).toBeDefined();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(ticket).toBeDefined();
    expect(updatedTicket!.orderId).toBeUndefined();
    expect(message.ack).toHaveBeenCalled();

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const [eventName, eventProperties] = (natsWrapper.client
      .publish as jest.Mock).mock.calls[0];

    expect(eventName).toBe(Subjects.TicketUpdated);
    expect(JSON.parse(eventProperties)).toEqual({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version! + 1,
      orderId: undefined,
    } as TicketUpdatedEvent["data"]);
  });
});
