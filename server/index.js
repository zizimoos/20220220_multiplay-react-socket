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
let coins = [];
for (let i = 0; i < 20; i++) {
  coins.push({ id: i, x: Math.random() * 800, y: Math.random() * 600 });
}

io.on("connection", (socket) => {
  console.log(`a user connected : ${socket.id}`);

  socket.emit("init", {
    id: socket.id,
    playersArryServer: playersArryServer,
    coins,
  });

  socket.on("new-player", (obj) => {
    obj.id = socket.id;
    playersArryServer.push(obj);
    socket.broadcast.emit("new-player", obj);
  });

  socket.on("move-player", (dir) => {
    socket.broadcast.emit("move-player", { id: socket.id, dir });
  });
  socket.on("stop-player", (dir) => {
    socket.broadcast.emit("stop-player", { id: socket.id, dir });
  });

  socket.on("destroy-coin", (id) => {
    coins = coins.filter((i) => i.id !== id);
    socket.broadcast.emit("destroy-coin", id);
    const player = playersArryServer.find((p) => p.id === socket.id);
    player.xp += 10;
  });

  console.log("playersArryServer", playersArryServer.length);
  socket.on("disconnect", (socket) => {
    console.log(`user disconnected : ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
