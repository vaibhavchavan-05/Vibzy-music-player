import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// DB
connectDB();

app.get("/api", (req, res) => {
  res.json({ message: "server is working" });
});

app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
