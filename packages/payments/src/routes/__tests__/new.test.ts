import request from "supertest";
import { app } from "@ticketing/payments/src/app";
import mongoose from "mongoose";
import { Order } from "@ticketing/payments/src/models/order";
import { OrderStatus } from "@ticketing/backend-core";

describe("POST /api/payments", () => {
  it("returns 404 when the order id is fake", async () => {
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({
        orderId: mongoose.Types.ObjectId().toHexString(),
        token: "1234",
      })
      .expect(404);
  });

  it("returns 401 when the order does not belong to the current user", async () => {
    const order = await Order.create({
      price: 50,
      status: OrderStatus.Created,
      userId: "555",
      version: 0,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin())
      .send({ orderId: order.id, token: "1234" })
      .expect(401);
  });

  it("returns 400 when the order is canceled", async () => {
    const userId = "555";
    const order = await Order.create({
      price: 50,
      status: OrderStatus.Cancelled,
      userId,
      version: 0,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({ orderId: order.id, token: "1234" })
      .expect(400);
  });
});
