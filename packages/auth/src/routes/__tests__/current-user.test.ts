import request from "supertest";
import { app } from "@ticketing/auth/src/app";

describe("GET /api/users/currentuser", () => {
  it("responds with details about the current user", async () => {
    const cookie = await global.signin();

    const res = await request(app)
      .get("/api/users/currentuser")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(res.body).toEqual({
      currentUser: {
        userId: expect.any(String),
        email: "test@test.com",
        iat: expect.any(Number),
      },
    });
  });

  it("returns a current user of null when not authenticated", async () => {
    await request(app).get("/api/users/currentuser").send().expect(400, {});
  });
});
