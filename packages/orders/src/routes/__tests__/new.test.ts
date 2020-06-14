import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { OrderStatus, Subjects } from "@ticketing/backend-core";
import { natsWrapper } from "../../nats-wrapper";

describe("POST /api/orders", () => {
  it("returns an error if the ticket does not exist", async () => {
    const ticketId = mongoose.Types.ObjectId();

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({
        ticketId,
      })
      .expect(404);
  });

  it("returns an error if the ticket is already reserved", async () => {
    const ticket = await Ticket.create({
      price: 25.0,
      title: "Dermot Kennedy",
    });

    await Order.create({
      expiresAt: new Date(),
      status: OrderStatus.Created,
      userId: "1234",
      ticket,
    });

    const ticketId = ticket.id;

    await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({
        ticketId,
      })
      .expect(400);
  });

  it("reserves a ticket", async () => {
    const ticket = await Ticket.create({
      price: 25.0,
      title: "Dermot Kennedy",
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    expect(res.body.order.id).not.toBeNull();
    expect(res.body.order.status).toBe(OrderStatus.Created);
    expect(res.body.order.userId).toBe("1234");
    expect(res.body.order.expiresAt).not.toBeNull();
    expect(res.body.order.ticket).not.toBeNull();
  });

  it("emits an order created event", async () => {
    const ticket = await Ticket.create({
      price: 25.0,
      title: "Dermot Kennedy",
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({
        ticketId: ticket.id,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
      Subjects.OrderCreated,
      expect.any(String),
      expect.any(Function)
    );
  });
});
