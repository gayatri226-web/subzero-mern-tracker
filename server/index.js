require("dotenv").config(); // 🔥 REQUIRED

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===================== */
/* ENV + MIDDLEWARE */
/* ===================== */

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(express.json());

/* ===================== */
/* MONGODB CONNECTION */
/* ===================== */

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* ===================== */
/* INCOME MODEL + ROUTES */
/* ===================== */

const IncomeSchema = new mongoose.Schema(
  {
    source: String,
    amount: Number,
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", IncomeSchema);

app.get("/api/income", async (req, res) => {
  const data = await Income.find().sort({ createdAt: -1 });
  res.json(data);
});

app.post("/api/income", async (req, res) => {
  const income = new Income(req.body);
  await income.save();
  res.status(201).json(income);
});

app.delete("/api/income/:id", async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ===================== */
/* EXPENSE MODEL + ROUTES */
/* ===================== */

const ExpenseSchema = new mongoose.Schema(
  {
    name: String,
    amount: Number,
    category: {
      type: String,
      default: "Other",
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

app.get("/api/subs", async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

app.post("/api/subs", async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.status(201).json(expense);
});

app.delete("/api/subs/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* ===================== */
/* HEALTH CHECK */
/* ===================== */

app.get("/test", (req, res) => {
  res.send("✅ SERVER WORKING");
});

/* ===================== */
/* START SERVER */
/* ===================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
