require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");
const { allowedOrigins } = require("./config/corsOptions");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH"],
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Socket connected: ${socket.id}`);
  }

  socket.on("joinExpertRoom", ({ expertId }) => {
    if (!expertId) return;

    socket.join(`expert:${expertId}`);

    if (process.env.NODE_ENV === "development") {
      console.log(`Socket ${socket.id} joined room expert:${expertId}`);
    }
  });

  socket.on("disconnect", () => {
    if (process.env.NODE_ENV === "development") {
      console.log(`Socket disconnected: ${socket.id}`);
    }
  });
});

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
