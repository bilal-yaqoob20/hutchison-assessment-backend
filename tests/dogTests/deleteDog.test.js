import request from "supertest";
import { setupTestDB, teardownTestDB, app } from "../setup/testServer.js";
import { createTestUserAndGetToken } from "../setup/authHelper.js";
import Dog from "../../models/Dog.js";

let token, dogId;

beforeAll(async () => {
  await setupTestDB();
  token = await createTestUserAndGetToken();

  const dog = await Dog.create({ breed: "testBreed", subBreeds: [] });
  dogId = dog._id.toString();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("DELETE /api/dogs/:id", () => {
  it("should delete dog successfully", async () => {
    const res = await request(app)
      .delete(`/api/dogs/${dogId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const check = await Dog.findById(dogId);
    expect(check).toBeNull();
  });

  it("should return 404 if dog not found", async () => {
    const res = await request(app)
      .delete("/api/dogs/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
