"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLoginAndLoad() {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        setError(authError.message);
        return;
      }

      const token = authData.session?.access_token;

      if (!token) {
        setError("No access token.");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(result.detail || "Failed to load.");
        return;
      }

      setData(result);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLoginAndLoad}>
        {loading ? "Loading..." : "Login & Load"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
  <div style={{ marginTop: "20px" }}>
    <p><b>Name:</b> {data.full_name}</p>
    <p><b>Savings:</b> {data.savings_balance}</p>
    <p><b>Shares:</b> {data.shares_balance}</p>
    <p><b>Share Unit Price:</b> {data.share_unit_price}</p>
    <p><b>Total Share Value:</b> {data.total_share_value}</p>

    {data.active_loan ? (
      <div style={{ marginTop: "20px" }}>
        <h3>Active Loan</h3>
        <p><b>Amount:</b> {data.active_loan.amount}</p>
        <p><b>Total Repayment:</b> {data.active_loan.total_repayment}</p>
        <p><b>Total Repaid:</b> {data.active_loan.total_repaid}</p>
        <p><b>Remaining Balance:</b> {data.active_loan.remaining_balance}</p>
        <p><b>Status:</b> {data.active_loan.status}</p>
        <p><b>Purpose:</b> {data.active_loan.purpose}</p>
      </div>
    ) : (
      <p><b>Active Loan:</b> None</p>
    )}

    {data.recent_repayments && data.recent_repayments.length > 0 && (
      <div style={{ marginTop: "20px" }}>
        <h3>Recent Repayments</h3>
        {data.recent_repayments.map((repayment: any) => (
          <div
            key={repayment.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >
            <p><b>Amount:</b> {repayment.amount}</p>
            <p><b>Date:</b> {repayment.payment_date}</p>
            <p><b>Notes:</b> {repayment.notes || "—"}</p>
          </div>
        ))}
      </div>
    )}
  </div>
)}
