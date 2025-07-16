import request from "supertest";
import { setupTestDB, teardownTestDB, app } from "../setup/testServer.js";
import { createTestUserAndGetToken } from "../setup/authHelper.js";
import Dog from "../../models/Dog.js";

let token;

beforeAll(async () => {
  await setupTestDB();
  token = await createTestUserAndGetToken();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("POST /api/dogs", () => {
  it("should create a new dog", async () => {
    const newDog = {
      breed: "testBreed".toLowerCase(),
      subBreeds: ["testSubBreed"],
    };

    const res = await request(app)
      .post("/api/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newDog);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      breed: "testBreed".toLowerCase(),
      subBreeds: ["testSubBreed"],
    });

    const dbDog = await Dog.findOne({ breed: "testBreed".toLowerCase() });
    expect(dbDog).not.toBeNull();
  });

  it("should not create duplicate breed", async () => {
    await Dog.create({ breed: "duplicatebreed", subBreeds: [] });

    const res = await request(app)
      .post("/api/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ breed: "duplicatebreed" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Breed already exists");
  });

  it("should fail if request is invalid", async () => {
    const res = await request(app)
      .post("/api/dogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ breed: 123 });

    expect(res.status).toBe(400);
  });
});
