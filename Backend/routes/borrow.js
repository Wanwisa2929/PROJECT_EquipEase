// routes/borrow.js
const express = require("express");
const router = express.Router();
const Borrow = require("../models/Borrowing");
const Item = require("../models/Item");

// 🧩 ยืมอุปกรณ์
router.post("/", async (req, res) => {
  try {
    const { studentId, studentName, item, borrowDate, returnDate } = req.body;
    if (!studentId || !studentName || !item) {
      return res.status(400).json({ message: "กรอกข้อมูลให้ครบ" });
    }

    // ลดจำนวนคงเหลือ
    const found = await Item.findOne({ name: item });
    if (!found || found.remaining <= 0) {
      return res.status(400).json({ message: "อุปกรณ์หมด" });
    }
    found.remaining -= 1;
    await found.save();

    const now = new Date();
    const newBorrow = await Borrow.create({
      studentId,
      studentName,
      item,
      borrowDate,
      borrowTime: now.toLocaleTimeString("th-TH", { hour12: false }),
      returnDate,
      status: "Borrowed",
    });

    res.json({ message: "บันทึกการยืมเรียบร้อยแล้ว", borrow: newBorrow });
  } catch (err) {
    console.error("❌ Borrow error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧩 คืนอุปกรณ์
router.post("/return", async (req, res) => {
  try {
    const { borrowingId } = req.body;
    const record = await Borrow.findById(borrowingId);
    if (!record) return res.status(404).json({ message: "ไม่พบข้อมูลการยืม" });

    record.status = "Returned";
    record.returnTime = new Date().toLocaleTimeString("th-TH", { hour12: false });
    record.returnDate = new Date().toISOString().slice(0, 10);
    await record.save();

    const foundItem = await Item.findOne({ name: record.item });
    if (foundItem) {
      foundItem.remaining += 1;
      await foundItem.save();
    }

    res.json({ message: "คืนอุปกรณ์เรียบร้อยแล้ว", record });
  } catch (err) {
    console.error("❌ Return error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧩 รายการที่ยังไม่คืน (ฝั่ง user)
router.get("/", async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId, status: "Borrowed" } : { status: "Borrowed" };
    const list = await Borrow.find(filter).sort({ borrowDate: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧩 ประวัติทั้งหมด (ฝั่ง user)
router.get("/history", async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId } : {};
    const list = await Borrow.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧩 ✅ แอดมินดูรายการยืมทั้งหมด
router.get("/admin/borrowings", async (req, res) => {
  try {
    const list = await Borrow.find().sort({ borrowDate: -1 });
    res.json(list);
  } catch (err) {
    console.error("❌ Admin borrowings error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🧩 ✅ แอดมินดูประวัติทั้งหมด
router.get("/admin/history", async (req, res) => {
  try {
    const list = await Borrow.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error("❌ Admin history error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
