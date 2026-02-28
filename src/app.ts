import express from "express";
import { IndexRoutes } from "./app/routes";
import cookieParser from "cookie-parser";
import { envVars } from "./app/config/env";
import cors from "cors";
import { auth } from "./app/lib/auth";
import { toNodeHandler } from "better-auth/node";
import qs from "qs";

const app = express();
//* first query and filter
app.set("query parser", (str: string) => qs.parse(str));

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

app.use("/api/auth", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

//* Routes
app.use("/api/v2", IndexRoutes);

app.get("/", (req, res) => {
  res.send("Food Hunt Backend Server");
});

export default app;
