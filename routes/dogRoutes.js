import express from "express";
import Dog from "../models/Dog.js";
import { dogRequestSchema, dogResponseSchema } from "../schemas/dogSchemas.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const search = req.query.search || "";
  try {
    const query = search ? { breed: { $regex: search, $options: "i" } } : {};
    const dogs = await Dog.find(query).skip(offset).limit(limit);
    const validated = dogs.map((dog) => {
      const { value } = dogResponseSchema.validate(dog);
      return value;
    });

    res.json(validated);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch breeds" });
  }
});

router.post("/", async (req, res) => {
  const { error, value } = dogRequestSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { breed, subBreeds = [] } = value;
  try {
    const existingDog = await Dog.findOne({ breed: breed.toLowerCase() });
    if (existingDog) {
      return res.status(400).json({ error: "Breed already exists" });
    }
    const dog = new Dog({ breed: breed.toLowerCase(), subBreeds });
    await dog.save();
    const dogData = dog.toJSON();
    const { error: responseError, value: validatedResponse } =
      dogResponseSchema.validate(dogData);

    if (responseError) {
      return res.status(500).json({ error: "Invalid response format" });
    }

    res.status(201).json(validatedResponse);
  } catch (err) {
    res.status(500).json({ error: "Failed to create breed" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { subBreeds } = req.body;

    if (!Array.isArray(subBreeds)) {
      return res
        .status(400)
        .json({ error: "`subBreeds` must be an array of strings" });
    }

    const dog = await Dog.findByIdAndUpdate(
      req.params.id,
      { subBreeds },
      { new: true }
    );
    if (!dog) {
      return res.status(404).json({ error: "Breed not found" });
    }
    res.json({ dog, message: "Breed updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Dog.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Breed not found" });
    }

    res.json({ message: "Breed deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete breed" });
  }
});

export default router;
