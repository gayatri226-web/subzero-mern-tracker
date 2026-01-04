const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// GET
router.get("/", async (req, res) => {
  const income = await Income.find();
  res.json(income);
});

// POST
router.post("/", async (req, res) => {
  const income = new Income(req.body);
  const saved = await income.save();
  res.json(saved);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
