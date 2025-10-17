const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String },
  remaining: { type: Number, default: 5 }
}, { timestamps: true });
module.exports = mongoose.model("Item", itemSchema);
