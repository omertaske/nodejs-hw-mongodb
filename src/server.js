import express from "express";
import pino from "pino-http";
import cors from "cors";
import cookieParser from "cookie-parser";
import contactsRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import uploadRouter from "./routers/upload.js";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";

config();

const PORT = process.env.PORT || 3000;

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());
  app.use(pino({ transport: { target: "pino-pretty" } }));

  // routers
  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);
  app.use("/upload", uploadRouter);

  // static docs folder (ReDoc html template if you want to serve it)
  app.use("/docs", express.static(path.resolve("docs")));

  // swagger-ui-express on /api-docs (use bundled docs/swagger.json)
  const swaggerJsonPath = path.resolve("docs/swagger.json");
  if (fs.existsSync(swaggerJsonPath)) {
    try {
      const swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf-8"));
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      console.log("Swagger UI available at /api-docs");
    } catch (err) {
      console.warn("Could not parse docs/swagger.json:", err.message);
    }
  } else {
    console.warn("docs/swagger.json not found. Run `npm run build-docs` to generate it.");
  }

  app.use((req, res) => res.status(404).json({ message: "Not found" }));
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Something went wrong" });
  });

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
