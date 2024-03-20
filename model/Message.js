const mongoose = require("mongoose");
const MessageSchema = new mongoose.Schema({
  author: String,
  content: String,
  image: String,
});
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message;
