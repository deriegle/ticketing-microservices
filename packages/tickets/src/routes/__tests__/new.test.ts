import request from "supertest";
import { app } from "@ticketing/tickets/src/app";

describe("POST /api/tickets", () => {
  it("responds with a 201 when given correct data", async () => {
    const cookie = await global.signin();
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

  it("returns an error if invalid title is provided", async () => {});

  it("returns an error if invalid price is provided", async () => {});
});
