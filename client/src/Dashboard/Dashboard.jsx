import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import Expense from "../Expense/Expense";
import Income from "../Income/Income";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
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
        {/* DASHBOARD HOME */}
        {activePage === "dashboard" && (
          <>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Overview of your finances and auto-pay burn
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Income</p>
                <h2>₹ —</h2>
              </div>

              <div className="stat-card">
                <p>Auto-pay Burn</p>
                <h2>₹ —</h2>
              </div>

              <div className="stat-card">
                <p>Net Margin</p>
                <h2>₹ —</h2>
              </div>
            </div>
          </>
        )}

        {/* INCOME PAGE */}
        {activePage === "income" && <Income />}

        {/* EXPENSE PAGE */}
        {activePage === "expense" && <Expense />}
      </main>
    </div>
  );
}
