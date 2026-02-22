import express from "express";
import { IndexRoutes } from "./app/routes";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: [
      envVars.APP_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5002",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

//* Routes
app.use("/api/v2", IndexRoutes);
app.get("/", (req, res) => {
  res.json("Food Hunt Backend Server");
});

export default app;
