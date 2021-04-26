const { Server } = require("socket.io");
const { Service } = require("./comptoir/service");

// Le service metier des comptoirs
const comptoirService = Service();

const socket = (server, corsOptions) => {
  const io = new Server(server, {
    cors: { ...corsOptions, credentials: true, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    let room;
    let user;
    socket.on("disconnect", () => {
      console.log("user disconnected");
      room && socket.to(room).emit("update");
      user && comptoirService.leave(user);
    });
    socket.on("join", ({ me, comptoir }) => {
      console.log("join", me, comptoir);
      user = me;
      room = `Room-${comptoir.id}`;
      socket.join(room);
      console.log("join room", room);
      socket.to(room).emit("update");
    });
    socket.on("new-message", () => {
        console.log("new-message");
        io.to(room).emit("update");
      });
  });
};

exports.socket = socket;
