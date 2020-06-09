import request from "supertest";
import { app } from "@ticketing/tickets/src/app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

const mockId = new mongoose.Types.ObjectId().toHexString();

describe("PUT /api/tickets/:id", () => {
  it("returns a 401 when the ticket does not exist", async () => {
    await request(app)
      .put(`/api/tickets/${mockId}`)
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(401);
  });

  it("returns a 401 when the user is not signed in", async () => {
    return request(app)
      .put(`/api/tickets/${mockId}`)
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(401);
  });

  it("returns a 401 when the user does not own the ticket", async () => {
    const otherUserCookie = global.signin("5484392");
    const { body } = await request(app)
      .post("/api/tickets")
      .set("Cookie", otherUserCookie)
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    const ticketId = body.ticket.id;

    return request(app)
      .put(`/api/tickets/${ticketId}`)
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(401);
  });

  it("updates the ticket when user owns the ticket and valid data provided", async () => {
    const { body } = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    const ticketId = body.ticket.id;

    const res = await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
        price: 50.54,
      })
      .expect(200);

    expect(res.body).toEqual({
      ticket: {
        id: ticketId,
        title: "Dermot Kennedy",
        price: 50.54,
        userId: "1234",
      },
    });
  });

  it("returns an error if invalid title is provided", async () => {
    const { body } = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    const ticketId = body.ticket.id;

    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set("Cookie", global.signin())
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
    const { body } = await request(app)
      .post("/api/tickets")
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
        price: 23.54,
      })
      .expect(201);

    const ticketId = body.ticket.id;

    await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set("Cookie", global.signin())
      .send({
        title: "Dermot Kennedy",
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
});
