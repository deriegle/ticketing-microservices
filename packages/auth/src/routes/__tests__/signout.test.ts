import request from "supertest";
import { app } from "@ticketing/auth/src/app";

describe("POST /api/users/signout", () => {
  it("removes the cookie when you are logged in", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "12345678910",
      })
      .expect(201);

    const res = await request(app)
      .post("/api/users/signout")
      .send({})
      .expect(200, {});

    expect(res.get("Set-Cookie")[0]).toMatch(/^express:sess=; path=\/;/);
  });
});
