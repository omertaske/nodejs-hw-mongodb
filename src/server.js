import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { config } from "dotenv";
config();

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(pino({ transport: { target: "pino-pretty" } }));

  // only routers — no duplicate manual /contacts routes
  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
  });

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};