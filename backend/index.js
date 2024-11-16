import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected " + socket.id);
  socket.emit("Welcome", "welcome to server");
  io.emit("userStatus", { userId: socket.id, isActive: true });
  socket.on("message", (s) => {
    console.log(s);
    socket.broadcast.emit("sendingMessage", s);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected ${socket.id}`);
    io.emit("userStatus", { userId: socket.id, isActive: false });
  });
});

server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
