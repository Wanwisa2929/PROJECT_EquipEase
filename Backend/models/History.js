const mongoose = require("mongoose");
const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: String,
  studentId: String,
  studentName: String,
  item: String,
  borrowDate: String,
  borrowTime: String,
  returnDate: String,
  returnTime: String,
  status: { type: String, enum: ["Borrowed","Returned"], default: "Borrowed" }
}, { timestamps: true });
module.exports = mongoose.model("History", historySchema);
