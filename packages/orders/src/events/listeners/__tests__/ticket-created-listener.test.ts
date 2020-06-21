import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "@ticketing/orders/src/nats-wrapper";
import { TicketCreatedEvent } from "@ticketing/backend-core";
import { Ticket } from "../../../models/ticket";

const setup = async (): Promise<{
  listener: TicketCreatedListener;
  data: TicketCreatedEvent["data"];
  message: Message;
}> => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 23.54,
    title: "Dermot Kennedy",
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

describe("TicketCreatedListener", () => {
  it("creates and saves a ticket", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const newTicket = await Ticket.findById(data.id);

    expect(newTicket).toBeDefined();
    expect(newTicket!.price).toBe(data.price);
    expect(newTicket!.title).toBe(data.title);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
