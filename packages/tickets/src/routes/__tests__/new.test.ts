import request from "supertest";
import { app } from "@ticketing/tickets/src/app";

describe("POST /api/tickets", () => {
  it("responds with a 201 when given correct data", async () => {
    const cookie = global.signin();
    const response = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({
        title: "Dermot Kennedy",
        price: "23.54",
      })
      .expect(201);

    expect(response.body).toEqual({
      ticket: {
        id: expect.any(String),
        title: "Dermot Kennedy",
        price: "23.54",
      },
    });
  });

  it("returns a 401 when the user is not signed in", async () => {
    return request(app)
      .post("/api/tickets")
      .send({
        title: "Dermot Kennedy",
        price: "23.54",
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
        price: "23.54",
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
});
