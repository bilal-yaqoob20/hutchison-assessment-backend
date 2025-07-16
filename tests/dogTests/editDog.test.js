import request from "supertest";
import { setupTestDB, teardownTestDB, app } from "../setup/testServer.js";
import { createTestUserAndGetToken } from "../setup/authHelper.js";
import Dog from "../../models/Dog.js";

let token, dog;

beforeAll(async () => {
  await setupTestDB();
  token = await createTestUserAndGetToken();
  dog = await Dog.create({ breed: "updatebreed", subBreeds: ["original"] });
});

afterAll(async () => {
  await teardownTestDB();
});

describe("PUT /api/dogs/:id", () => {
  it("should update subBreeds", async () => {
    const res = await request(app)
      .put(`/api/dogs/${dog._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ subBreeds: ["new1", "new2"] });

    expect(res.status).toBe(200);
    expect(res.body.dog.subBreeds).toContain("new1");
  });

  it("should return 400 if subBreeds is not an array", async () => {
    const res = await request(app)
      .put(`/api/dogs/${dog._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ subBreeds: "notArray" });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/must be an array/i);
  });

  it("should return 404 for invalid ID", async () => {
    const res = await request(app)
      .put("/api/dogs/000000000000000000000000")
      .set("Authorization", `Bearer ${token}`)
      .send({ subBreeds: [] });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Breed not found");
  });
});
