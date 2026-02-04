require("dotenv").config(); // ✅ Load env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./middleware/auth"); // ✅ AUTH MIDDLEWARE

const app = express();

/* ===================== */
/* MIDDLEWARE */
/* ===================== */

app.use(
  cors({
    origin: "*",
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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

/* ---------- INCOME ROUTES ---------- */

// ✅ Get income (USER-SPECIFIC)
app.get("/api/income", auth, async (req, res) => {
  try {
    const data = await Income.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching income", error });
  }
});

// ✅ Add income (USER-SPECIFIC)
app.post("/api/income", auth, async (req, res) => {
  try {
    const income = new Income({
      ...req.body,
      user: req.user.id,
    });

    await income.save();
    res.status(201).json(income);
  } catch (error) {
    res.status(500).json({ message: "Error adding income", error });
  }
});

// ✅ Delete income (USER-SPECIFIC)
app.delete("/api/income/:id", auth, async (req, res) => {
  try {
    await Income.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: "Error deleting income", error });
  }
});

/* ---------- EXPENSE ROUTES ---------- */

// ✅ Get expenses (USER-SPECIFIC)
app.get("/api/subs", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
});

// ✅ Add expense (USER-SPECIFIC)
app.post("/api/subs", auth, async (req, res) => {
  try {
    const expense = new Expense({
      ...req.body,
      user: req.user.id,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error adding expense", error });
  }
});

// ✅ Delete expense (USER-SPECIFIC)
app.delete("/api/subs/:id", auth, async (req, res) => {
  try {
    await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
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
