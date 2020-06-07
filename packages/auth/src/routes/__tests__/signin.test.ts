import request from "supertest";
import { app } from "@ticketing/auth/src/app";

describe("POST /api/users/signin", () => {
  it("fails when a email that does not exist is supplied", async () => {
    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "12345678910",
      })
      .expect(400);
  });

  it("fails when an incorrect password is supplied", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "12345678910",
      })
      .expect(201);

    await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "12345",
      })
      .expect(400, {
        errors: [
          {
            message: "Invalid email or password",
          },
        ],
      });
  });

  it("is successful with a cookie with valid creds", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "12345678910",
      })
      .expect(201);

    const res = await request(app)
      .post("/api/users/signin")
      .send({
        email: "test@test.com",
        password: "12345678910",
      })
      .expect(200);

    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
