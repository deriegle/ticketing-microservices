import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@ticketing/backend-core";

const buildTicket = () =>
  Ticket.create({
    price: 23.54,
    title: "Dermot Kennedy",
  });

describe("GET /api/orders/:orderId", () => {
  it("returns an empty array when the user has no orders", async () => {
    await request(app)
      .get("/api/orders")
      .set("Cookie", global.signin())
      .send()
      .expect(200, {
        orders: [],
      });
  });

  it("returns the expected orders for the user", async () => {
    const ticket = await Ticket.create({
      price: 23.54,
      title: "Dermot Kennedy",
    });

    const orderResponse = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const orderId = orderResponse.body.order.id;

    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Cookie", global.signin())
      .send()
      .expect(200);

    expect(res.body).toEqual({
      order: {
        userId: "1234",
        expiresAt: expect.any(String),
        status: OrderStatus.Created,
        ticket: {
          id: ticket.id,
          price: ticket.price,
          title: ticket.title,
        },
        id: orderId,
      },
    });
  });
});
