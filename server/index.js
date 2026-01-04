const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:dMFQysVWQ7fa9B7C@cluster0.rtaed3t.mongodb.net/subzero"
);

const IncomeSchema = new mongoose.Schema({
  source: String,
  amount: Number,
});

const Income = mongoose.model("Income", IncomeSchema);

app.get("/api/income", async (req, res) => {
  const data = await Income.find();
  res.json(data);
});

app.post("/api/income", async (req, res) => {
  const income = new Income(req.body);
  await income.save();
  res.json(income);
});

app.delete("/api/income/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

app.listen(5000, () => {
  console.log("SERVER STARTED ON 5000");
});
