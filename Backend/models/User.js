const mongoose = require("mongoose");

// ✅ สร้าง Schema สำหรับเก็บข้อมูลผู้ใช้
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // เช่น 67025055@up.ac.th หรือ admin
  password: { type: String, required: true }, // ใช้ password (ไม่ใช่ passwordHash)
  name: { type: String, required: true }, // ชื่อผู้ใช้
  role: { type: String, enum: ["admin", "user"], default: "user" } // บทบาทในระบบ
});

// ✅ ส่งออกโมเดล
module.exports = mongoose.model("User", userSchema);
