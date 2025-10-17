const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// get all items
router.get("/", async (req,res)=>{
  const items = await Item.find().sort({ name: 1 });
  res.json(items);
});

// admin create
router.post("/", auth, isAdmin, async (req,res)=>{
  try {
    const it = await Item.create(req.body);
    res.json(it);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

// admin update
router.put("/:id", auth, isAdmin, async (req,res)=>{
  try {
    const it = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(it);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

module.exports = router;
