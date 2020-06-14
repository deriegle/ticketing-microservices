import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";

describe("DELETE /api/orders/:orderId", () => {
  it.todo("returns 404 when ticket does not exist");
  it.todo("returns 401 when ticket is not owned by the current user");

  it("marks an order as cancelled", async () => {
    const ticket = await Ticket.create({
      price: 25,
      title: "Dermot Kennedy",
    });

    const { body } = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const orderId = body.order.id;

    await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Cookie", global.signin())
      .send()
      .expect(204);
  });

  it.todo("emits an order cancelled event");
});
