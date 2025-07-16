import request from "supertest";
import { setupTestDB, teardownTestDB, app } from "../setup/testServer.js";
import User from "../../models/User.js";

beforeAll(setupTestDB);
afterAll(teardownTestDB);

describe("POST /api/auth/register", () => {
  it("should create a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User created");

    const user = await User.findOne({ email: "test@example.com" });
    expect(user).not.toBeNull();
  });

  it("should not allow duplicate email", async () => {
    await User.create({ email: "duplicate@example.com", password: "hashed" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "duplicate@example.com", password: "anotherpass" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already exists");
  });
});
