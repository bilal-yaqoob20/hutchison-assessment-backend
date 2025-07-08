import mongoose from "mongoose";
import Dog from "./models/Dog";
import dogsData from "./dogs.json";
import dotenv from "dotenv";
dotenv.config();

async function importData() {
  await mongoose.connect(process.env.MONGO_URI);
  for (const [breed, subBreeds] of Object.entries(dogsData)) {
    await Dog.updateOne({ breed }, { breed, subBreeds }, { upsert: true });
  }
  console.log("Data imported successfully");
  process.exit();
}

importData();
