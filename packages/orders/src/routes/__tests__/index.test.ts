import request from "supertest";
import { Order } from "../../models/order";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@ticketing/backend-core";

const buildTicket = () =>
  Ticket.create({
    price: 23.54,
    title: "Dermot Kennedy",
  });

describe("GET /api/orders", () => {
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
    const ticket = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();

    const user1 = global.signin("1234");
    const user2 = global.signin("55555");

    await request(app)
      .post("/api/orders")
      .set("Cookie", user1)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    const orderResponse2 = await request(app)
      .post("/api/orders")
      .set("Cookie", user2)
      .send({
        ticketId: ticket2.id,
      })
      .expect(201);

    const orderResponse3 = await request(app)
      .post("/api/orders")
      .set("Cookie", user2)
      .send({
        ticketId: ticket3.id,
      })
      .expect(201);

    const res = await request(app)
      .get("/api/orders")
      .set("Cookie", user2)
      .send()
      .expect(200);

    expect(res.body).toEqual({
      orders: [
        {
          userId: "55555",
          expiresAt: expect.any(String),
          status: OrderStatus.Created,
          ticket: {
            id: ticket2.id,
            price: ticket2.price,
            title: ticket2.title,
          },
          id: orderResponse2.body.order.id,
        },
        {
          userId: "55555",
          expiresAt: expect.any(String),
          status: OrderStatus.Created,
          ticket: {
            id: ticket3.id,
            price: ticket3.price,
            title: ticket3.title,
          },
          id: orderResponse3.body.order.id,
        },
      ],
    });
  });
});
