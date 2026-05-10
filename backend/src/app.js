const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { corsOptions } = require("./config/corsOptions");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

app.use("/experts", expertRoutes);
app.use("/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
