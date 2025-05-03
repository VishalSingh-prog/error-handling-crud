import express from "express";
import axios from "axios";
import cors from "cors";
import { logger } from "./logger.js";

const app = express();
app.use(cors());
app.use(express.json());

const API = "https://jsonplaceholder.typicode.com";

async function forward(req, res, next) {
  try {
    const url = `${API}${req.originalUrl}`;
    const { data } = await axios({ url, method: req.method, data: req.body });
    if (!data) throw new Error("Empty response body");
    res.json(data);
  } catch (err) {
    next(err);
  }
}

app.use("/posts", forward);           // CRUD demo resource
app.use("/users", forward);           // any others you want

/* --- Centralised error handler --- */
app.use((err, _req, res, _next) => {
  logger.error(err.message, { stack: err.stack });
  const code =
    err.response?.status ??                       // remote error
    (err.code === "ECONNREFUSED" ? 503 : 500);    // network/downstream
  res.status(code).json({ message: err.message });
});

app.listen(3001, () =>
  logger.info("Backend listening on http://localhost:3001")
);
