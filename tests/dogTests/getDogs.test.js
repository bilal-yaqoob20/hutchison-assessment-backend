import request from "supertest";
import { setupTestDB, teardownTestDB, app } from "../setup/testServer.js";
import { createTestUserAndGetToken } from "../setup/authHelper.js";
import Dog from "../../models/Dog.js";
import dogsData from "../../dogs.json";

let token;

beforeAll(async () => {
  await setupTestDB();
  token = await createTestUserAndGetToken();
  const localData = Object.entries(dogsData).map(([breed, subBreeds]) => ({
    breed,
    subBreeds,
  }));
  await Dog.insertMany(localData);
});

afterAll(async () => {
  await teardownTestDB();
});

describe("GET /api/dogs", () => {
  it("should return list of dogs with pagination", async () => {
    const totalDogs = await Dog.countDocuments();
    const totalPages = Math.ceil(totalDogs / 10);
    for (let i = 0; i < totalPages; i++) {
      const res = await request(app)
        .get(`/api/dogs?limit=10&offset=${i}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });
});
