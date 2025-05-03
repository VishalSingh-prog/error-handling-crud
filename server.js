import express from "express";
import cors from "cors";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./logger.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.get("/posts", async (req, res) => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    if (!Array.isArray(response.data))
      throw new Error("Invalid response format");
    res.json(response.data);
  } catch (error) {
    logger.error(`GET /posts failed: ${error.message}`);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      req.body
    );
    res.status(201).json(response.data);
  } catch (error) {
    logger.error(`POST /posts failed: ${error.message}`);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Serve index.html for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
