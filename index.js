import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dogRoutes from "./routes/dogRoutes.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL_LIVE,
  process.env.FRONTEND_URL_LOCAL,
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

app.use("/api/dogs", dogRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
