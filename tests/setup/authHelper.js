import bcrypt from "bcryptjs";
import request from "supertest";
import User from "../../models/User.js";
import { app } from "./testServer.js";

export const createTestUserAndGetToken = async () => {
  const email = "test@example.com";
  const plainPassword = "123456";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await User.create({ email, password: hashedPassword });

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email, password: plainPassword });

  return res.body.token;
};
