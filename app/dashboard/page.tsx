"use client";

import { useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [token, setToken] = useState("");

  async function fetchDashboard() {
    const res = await fetch(
      "https://bosere-cooperative-clean-production.up.railway.app/api/dashboard/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await res.json();
    setData(result);
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <textarea
        placeholder="Paste token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <br />

      <button onClick={fetchDashboard}>
        Load
      </button>

      {data && (
        <div>
          <p>{data.full_name}</p>
          <p>Savings: {data.savings_balance}</p>
          <p>Shares: {data.shares_balance}</p>
        </div>
      )}
    </div>
  );
}
