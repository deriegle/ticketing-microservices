import request from "supertest";
import { app } from "@ticketing/tickets/src/app";

function createTicket(title: string, price: number) {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
}

describe("GET /api/tickets", () => {
  it("returns empty when there are no tickets created", async () => {
    await request(app).get("/api/tickets").send().expect(200, {
      tickets: [],
    });
  });

  it("returns tickets when some exist", async () => {
    await createTicket("Dermot Kennedy", 23.54);
    await createTicket("Dermot Kennedy", 43.54);
    await createTicket("Dermot Kennedy", 58.54);

    const res = await request(app).get("/api/tickets").send().expect(200);

    expect(res.body).toEqual({
      tickets: [
        {
          title: "Dermot Kennedy",
          price: 23.54,
          id: expect.any(String),
          userId: "1234",
        },
        {
          title: "Dermot Kennedy",
          price: 43.54,
          id: expect.any(String),
          userId: "1234",
        },
        {
          title: "Dermot Kennedy",
          price: 58.54,
          id: expect.any(String),
          userId: "1234",
        },
      ],
    });
  });
});
