// routes/history.js
const express = require("express");
const router = express.Router();
const Borrowing = require("../models/Borrowing");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ✅ ตรวจสอบ token
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// ✅ GET /api/history
router.get("/", auth, async (req, res) => {
  try {
    // ดึงเฉพาะของ user ที่คืนแล้ว
    const history = await Borrowing.find({
      studentId: req.user.username,
      status: "Returned"
    }).sort({ returnDate: -1, returnTime: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cannot load history" });
  }
});

module.exports = router;
