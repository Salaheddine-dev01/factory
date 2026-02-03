// backend/src/server.ts
import dotenv from 'dotenv';
dotenv.config();  // must be first
import express from "express";
import cors from "cors";
import interventionsRouter from "./routes/interventions";
import authRouter from "./routes/auth";
import exportRouter from "./routes/export";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/interventions", interventionsRouter);
app.use("/api/export", exportRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});