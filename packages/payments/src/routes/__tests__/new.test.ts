import request from "supertest";
import { app } from "@ticketing/payments/src/app";
import mongoose from "mongoose";
import { Order } from "@ticketing/payments/src/models/order";
import { OrderStatus } from "@ticketing/backend-core";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

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

  it("returns a 204 with valid inputs", async () => {
    const userId = "555";
    const order = await Order.create({
      price: 50,
      status: OrderStatus.Created,
      userId,
      version: 0,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({ orderId: order.id, token: "tok_visa" })
      .expect(204);

    expect(stripe.charges.create).toHaveBeenCalledWith({
      currency: "usd",
      amount: 5000,
      source: "tok_visa",
    });
  });

  it("creates a payment with valid inputs", async () => {
    const userId = "555";
    const order = await Order.create({
      price: 50,
      status: OrderStatus.Created,
      userId,
      version: 0,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signin(userId))
      .send({ orderId: order.id, token: "tok_visa" })
      .expect(204);

    expect(stripe.charges.create).toHaveBeenCalledWith({
      currency: "usd",
      amount: 5000,
      source: "tok_visa",
    });

    const payment = await Payment.findOne({
      orderId: order.id,
    });

    expect(payment).not.toBeNull();
    expect(payment!.orderId).toBe(order.id);
    expect(payment!.stripeChargeId).toBe("fake_stripe_id");
  });
});
