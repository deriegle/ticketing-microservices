import request from "supertest";
import { app } from "@ticketing/tickets/src/app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("POST /api/tickets", () => {
  it("responds with a 201 when given correct data", async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);

    const cookie = global.signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets.length).toBe(1);
    expect(response.body).toEqual({
      ticket: {
        id: expect.any(String),
        title: "Dermot Kennedy",
        price: 23.54,
        userId: expect.any(String),
      },
    });
  });

  it("returns a 401 when the user is not signed in", async () => {
    return request(app)
      .post("/api/tickets")
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(401);
  });

  it("returns an error if invalid title is provided", async () => {
    const cookie = global.signin();
    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "",
        price: 23.54,
      })
      .expect(400, {
        errors: [
          {
            message: "Title is required",
            field: "title",
          },
        ],
      });
  });

  it("returns an error if invalid price is provided", async () => {
    const cookie = global.signin();

    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "Dermot Kennedy",
        price: null,
      })
      .expect(400, {
        errors: [
          {
            message: "Price must be greater than 0",
            field: "price",
          },
        ],
      });

    await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "Dermot Kennedy",
        price: -10.0,
      })
      .expect(400, {
        errors: [
          {
            message: "Price must be greater than 0",
            field: "price",
          },
        ],
      });
  });

  it("publishes an event", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
