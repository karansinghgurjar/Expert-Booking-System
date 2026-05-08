const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
