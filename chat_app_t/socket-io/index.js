const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("connected : ", socket);

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
    }

    console.log("online Users : ", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientUser
    );

    if (user) {
      console.log(user, "get message emited");

      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  socket.on("typingmsg", (data) => {
    const recipientUser = data.chat.members.find((id) => id !== data.senderId);

    const user = onlineUsers.find((user) => user.userId === recipientUser);

    if (user) {
      io.to(user.socketId).emit("typing", data);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
