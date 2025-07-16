import request from "supertest";
import bcrypt from "bcryptjs";
import { setupTestDB, teardownTestDB, app } from "../setup/testServer.js";
import User from "../../models/User.js";

beforeAll(async () => {
  await setupTestDB();
  const hashed = await bcrypt.hash("123456", 10);
  await User.create({ email: "test@example.com", password: hashed });
});

afterAll(teardownTestDB);

describe("POST /api/auth/login", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "123456" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid@example.com", password: "123456" });

    expect(res.status).toBe(401);
  });

  it("should not login with incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
  });
});
