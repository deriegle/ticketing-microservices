import request from "supertest";
import { app } from "@ticketing/tickets/src/app";

describe("GET /api/tickets/:id", () => {
  it("returns 404 when the ticket does not exist", async () => {
    await request(app).get("/api/tickets/1").send().expect(404);
  });

  it("shows you a ticket when it exists", async () => {
    const cookie = global.signin();
    const { body } = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    const ticketId = body.ticket.id;

    await request(app)
      .get(`/api/tickets/${ticketId}`)
      .send()
      .expect(200, {
        ticket: {
          id: ticketId,
          title: "Dermot Kennedy",
          price: 23.54,
          userId: "1234",
        },
      });
  });
});
