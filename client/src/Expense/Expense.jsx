import { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../Dashboard/Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    category: "Other",
  });
  const [loading, setLoading] = useState(false);

  /* 🔄 FETCH EXPENSES */
  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subs");
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch expenses error:", err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* ➕ ADD EXPENSE */
  const addExpense = async () => {
    if (!form.name || !form.amount) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/subs", {
        name: form.name,
        amount: Number(form.amount),
        category: form.category,
      });

      setForm({ name: "", amount: "", category: "Other" });
      fetchExpenses();
    } catch (err) {
      console.error(
        "Add expense error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* ❌ DELETE EXPENSE */
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/subs/${id}`);
      fetchExpenses();
    } catch (err) {
      console.error("Delete expense error:", err.message);
    }
  };

  /* 📊 CHART LOGIC */
  const categoryTotals = expenses.reduce((acc, curr) => {
    const category = curr.category || "Other";
    acc[category] = (acc[category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ef4444",
          "#22c55e",
          "#3b82f6",
          "#eab308",
          "#a855f7",
        ],
      },
    ],
  };

  return (
    <>
      <h1>Expense Tracking</h1>
      <p className="subtitle">Expenses stored securely</p>

      <div className="stats-grid">
        {/* ADD EXPENSE */}
        <div className="stat-card">
          <h3>Add Expense</h3>

          <input
            className="login-input"
            placeholder="Expense name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            className="login-input"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({ ...form, amount: e.target.value })
            }
          />

          <select
            className="login-input"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option>Food</option>
            <option>Transport</option>
            <option>Rent</option>
            <option>Entertainment</option>
            <option>Other</option>
          </select>

          <button
            className="login-button"
            onClick={addExpense}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </button>
        </div>

        {/* PIE CHART */}
        <div className="stat-card">
          <h3>Expense Breakdown</h3>

          {expenses.length === 0 ? (
            <p className="subtitle">No expenses yet</p>
          ) : (
            <Pie data={chartData} />
          )}
        </div>
      </div>

      {/* EXPENSE LIST */}
      <div className="stat-card" style={{ marginTop: "24px" }}>
        <h3>Expense List</h3>

        {expenses.length === 0 ? (
          <p className="subtitle">No expenses added</p>
        ) : (
          expenses.map((e) => (
            <div
              key={e._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
              }}
            >
              <span>
                {e.name} ({e.category})
              </span>
              <span>
                ₹{e.amount}
                <button
                  onClick={() => deleteExpense(e._id)}
                  style={{
                    marginLeft: "12px",
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}
