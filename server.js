const connectDB = require("./db/connect");
const express = require("express");
const Message = require("./model/Message");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// Connect to MongoDB
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

io.on("connection", (socket) => {
  console.log("new client connected");
  Message.find({}).then((messages) => {
    socket.emit("load messages", messages);
  });

  socket.on("username", (username) => {
    console.log(username);
    socket.username = username;
    io.emit("user joined", username);
  });
  socket.on("disconnect", () => {
    io.emit("user left", socket.username);
  });
  socket.on("chat message", (msg) => {
    console.log(msg);
    const message = Message.create({
      author: msg.author,
      content: msg.content,
      image: msg.img,
    })
      .then(() => {
        io.emit("chat message", msg);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const start = async () => {
  try {
    await connectDB(process.env.MONG_URI);
    http.listen(5000, console.log(`listening to port 5k`));
  } catch (error) {
    console.log(error);
  }
};

start();
