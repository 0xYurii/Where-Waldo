import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express application
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello from index" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
