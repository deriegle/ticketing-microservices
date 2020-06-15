import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@ticketing/backend-core";
import { Ticket } from "@ticketing/orders/src/models/ticket";

const setup = async (): Promise<{
  listener: TicketUpdatedListener;
  data: TicketUpdatedEvent["data"];
  message: Message;
}> => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = await Ticket.create({
    price: 23.54,
    title: "Dermot Kennedy",
  });

  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    price: 25,
    title: ticket.title,
    version: 1,
    userId: "1234",
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, data, message };
};

describe("TicketUpdatedListener", () => {
  it("updates and saves a ticket", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const newTicket = await Ticket.findById(data.id);

    expect(newTicket).toBeDefined();
    expect(newTicket!.price).toBe(data.price);
    expect(newTicket!.title).toBe(data.title);
    expect(newTicket!.version).toBe(data.version);
  });

  it("acks the message", async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it("throws an error when the version is out of order", async () => {
    const { listener, data, message } = await setup();

    data.version = 10;
    expect(listener.onMessage(data, message)).rejects.toMatch(
      /Ticket not found/i
    );
    expect(message.ack).not.toHaveBeenCalled();
  });
});
