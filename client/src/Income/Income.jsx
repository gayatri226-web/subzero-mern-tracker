import { useEffect, useState } from "react";
import axios from "axios";
import "../Dashboard/Dashboard.css";

export default function Income() {
  const [income, setIncome] = useState([]);
  const [form, setForm] = useState({
    source: "",
    amount: "",
  });

  // Fetch income from MongoDB
  const fetchIncome = async () => {
    const res = await axios.get("http://localhost:5000/api/income");
    setIncome(res.data);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Add income
  const addIncome = async () => {
    if (!form.source || !form.amount) return;

    await axios.post("http://localhost:5000/api/income", {
      source: form.source,
      amount: Number(form.amount),
    });

    setForm({ source: "", amount: "" });
    fetchIncome();
  };

  // Delete income
  const deleteIncome = async (id) => {
    await axios.delete(`http://localhost:5000/api/income/${id}`);
    fetchIncome();
  };

  // Total monthly income
  const totalIncome = income.reduce(
    (sum, i) => sum + Number(i.amount),
    0
  );

  return (
    <>
      <h1>Income</h1>
      <p className="subtitle">Track your monthly earnings</p>

      <div className="stats-grid">
        {/* ADD INCOME */}
        <div className="stat-card">
          <h3>Add Income</h3>

          <input
            className="login-input"
            placeholder="Source (Salary, Freelance)"
            value={form.source}
            onChange={(e) =>
              setForm({ ...form, source: e.target.value })
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

          <button className="login-button" onClick={addIncome}>
            Add Income
          </button>
        </div>

        {/* TOTAL INCOME */}
        <div className="stat-card">
          <h3>Total Monthly Income</h3>
          <h2>₹{totalIncome.toFixed(2)}</h2>
        </div>
      </div>

      {/* LIST */}
      <div className="stat-card" style={{ marginTop: "24px" }}>
        <h3>Income Sources</h3>

        {income.length === 0 ? (
          <p className="subtitle">No income added yet</p>
        ) : (
          income.map((i) => (
            <div
              key={i._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
              }}
            >
              <span>{i.source}</span>
              <span>
                ₹{i.amount}
                <button
                  onClick={() => deleteIncome(i._id)}
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
