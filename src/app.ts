import express from "express";

const app = express();
app.use(express.json());

//* Routes
app.get("/", (req, res) => {
  res.json("Food Hunt Backend Server");
});

export default app;
