import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Expense from "../Expense/Expense";
import Income from "../Income/Income";
import "./Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BASE_URL =
  import.meta.env.VITE_API_URL || "https://subzero-expense-tracker-2.onrender.com";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalBurn, setTotalBurn] = useState(0);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  /* 🔑 Fetch income + expenses and calculate stats */
  const fetchDashboardData = async () => {
    try {
      const [incomeRes, subsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/income`),
        axios.get(`${BASE_URL}/api/subs`),
      ]);

      const incomeTotal = incomeRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      const burnTotal = subsRes.data.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      setTotalIncome(incomeTotal);
      setTotalBurn(burnTotal);
    } catch (err) {
      console.error("Dashboard fetch error", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const netMargin = totalIncome - totalBurn;

  /* 📊 GRAPH DATA */
  const barData = {
    labels: ["Total Income", "Auto-pay Burn", "Net Margin"],
    datasets: [
      {
        label: "Amount (₹)",
        data: [totalIncome, totalBurn, netMargin],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
          netMargin >= 0 ? "#3b82f6" : "#f97316",
        ],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="sidebar-logo">SUBZERO</h2>

        <nav className="sidebar-nav">
          <button
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

          <button
            className={activePage === "income" ? "active" : ""}
            onClick={() => setActivePage("income")}
          >
            Income
          </button>

          <button
            className={activePage === "expense" ? "active" : ""}
            onClick={() => setActivePage("expense")}
          >
            Expense
          </button>
        </nav>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        {activePage === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Real-time overview of income vs auto-pay burn
            </p>

            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Income</p>
                <h2>₹{totalIncome}</h2>
              </div>

              <div className="stat-card">
                <p>Auto-pay Burn</p>
                <h2>₹{totalBurn}</h2>
              </div>

              <div
                className={`stat-card ${netMargin < 0 ? "danger" : "success"}`}
              >
                <p>Net Margin</p>
                <h2>₹{netMargin}</h2>
              </div>
            </div>

            {/* 📊 GRAPH */}
            <div className="stat-card" style={{ marginTop: "32px" }}>
              <h3>Financial Overview</h3>
              <Bar data={barData} options={barOptions} />
            </div>
          </>
        )}

        {activePage === "income" && <Income onUpdate={fetchDashboardData} />}

        {activePage === "expense" && <Expense onUpdate={fetchDashboardData} />}
      </main>
    </div>
  );
}
