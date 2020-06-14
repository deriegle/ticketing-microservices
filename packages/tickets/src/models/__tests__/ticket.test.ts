import { Ticket } from "../ticket";

describe("Ticket", () => {
  it("implements optimistic concurrency control", async () => {
    const ticket = await Ticket.create({
      title: "concert",
      price: 5,
      userId: "1234",
    });

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
      await secondInstance!.save();
    } catch (err) {
      expect(err.message).toMatch(
        /No matching document found for id \"(.+)\" version 0/
      );
    }

    expect.assertions(1);
  });

  it("increments the version number on multiple saves", async () => {
    const ticket = await Ticket.create({
      price: 25.34,
      title: "Dermot Kennedy",
      userId: "1234",
    });

    expect(ticket.version).toBe(0);
    await ticket.save();
    expect(ticket.version).toBe(1);
    await ticket.save();
    expect(ticket.version).toBe(2);
  });
});
