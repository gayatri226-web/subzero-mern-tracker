require("dotenv").config(); // ✅ Load env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ===================== */
/* MIDDLEWARE */
/* ===================== */

app.use(
  cors({
    origin: "*", // ✅ for now (later we can restrict to Vercel url)
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

app.use(express.json());

/* ===================== */
/* MONGODB CONNECTION */
/* ===================== */

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables!");
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
/* INCOME SCHEMA + MODEL */
/* ===================== */

const IncomeSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", IncomeSchema);

/* ===================== */
/* EXPENSE SCHEMA + MODEL */
/* ===================== */

const ExpenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, default: "Other" },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

/* ===================== */
/* ROUTES */
/* ===================== */

// ✅ Health Check
app.get("/test", (req, res) => {
  res.send("✅ SERVER WORKING");
});

// ✅ Income routes
app.get("/api/income", async (req, res) => {
  try {
    const data = await Income.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income", error });
  }
});

app.post("/api/income", async (req, res) => {
  try {
    const income = new Income(req.body);
    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error adding income", error });
  }
});

app.delete("/api/income/:id", async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
});

// ✅ Expense routes
app.get("/api/subs", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

app.post("/api/subs", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
});

app.delete("/api/subs/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
});

/* ===================== */
/* START SERVER */
/* ===================== */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
