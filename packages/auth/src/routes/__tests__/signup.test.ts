import request from "supertest";
import { app } from "@ticketing/auth/src/app";

describe("POST /api/users/signup", () => {
  it("responds with status 201 when successful", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });

  it("responds with a 400 with an invalid email or password", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        password: "12345678",
      })
      .expect(400);

    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
      })
      .expect(400);
  });

  it("responds with a 400 when given incorrect request", async () => {
    await request(app).post("/api/users/signup").send({}).expect(400);
  });
});
