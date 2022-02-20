const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

const playersArryServer = [];

io.on("connection", (socket) => {
  console.log(`a user connected : ${socket.id}`);

  socket.emit("init", { id: socket.id, playersArryServer: playersArryServer });

  socket.on("new-player", (obj) => {
    playersArryServer.push(obj);
    socket.broadcast.emit("new-player", obj);
  });

  socket.on("move-player", (dir) => {
    socket.broadcast.emit("move-player", { id: socket.id, dir });
  });
  socket.on("stop-player", (dir) => {
    socket.broadcast.emit("stop-player", { id: socket.id, dir });
  });

  console.log("playersArryServer", playersArryServer.length);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
