const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================================================
// 🔹 POST /api/auth/login
// รองรับทั้ง admin และ user หลายบัญชี
// ================================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ ตรวจสอบว่ากรอกครบไหม
    if (!username || !password) {
      return res.status(400).json({ message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ" });
    }

    // ✅ ค้นหาผู้ใช้ใน MongoDB (ทั้ง admin / user)
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(400).json({ message: "ไม่พบบัญชีผู้ใช้นี้" });
    }

    // ✅ ตรวจสอบรหัสผ่านด้วย bcrypt
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    // ✅ สร้าง JWT token พร้อมข้อมูลผู้ใช้
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" } // token มีอายุ 7 วัน
    );

    // ✅ ส่งข้อมูลกลับไปที่ Frontend
    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์" });
  }
});

// ================================================
// 🔹 GET /api/auth/test (optional) → ใช้เช็ค token ได้
// ================================================
router.get("/test", (req, res) => {
  res.json({ message: "Auth route is working ✅" });
});

module.exports = router;
