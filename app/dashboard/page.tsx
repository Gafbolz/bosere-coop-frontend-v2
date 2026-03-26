"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        window.location.href = "/login";
        return;
      }

      setUser(userData.user);

      const sessionResult = await supabase.auth.getSession();
      const accessToken = sessionResult.data.session?.access_token;

      if (!accessToken) {
        setError("No access token found.");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const text = await res.text();
        let result: any = null;

        try {
          result = JSON.parse(text);
        } catch {
          result = { raw: text };
        }

        if (!res.ok) {
          setError(
            result?.detail ||
              result?.message ||
              text ||
              "Failed to load dashboard data."
          );
          return;
        }

        setData(result);
      } catch (err: any) {
        setError(err?.message || "Something went wrong while loading dashboard.");
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (!user) {
    return <p style={{ padding: 20 }}>Loading user...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Email: {user.email}</p>

      <button onClick={handleLogout} style={{ marginBottom: 20 }}>
        Logout
      </button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data ? (
        <>
          <p>Name: {data.full_name}</p>
          <p>Savings: {data.savings_balance}</p>
          <p>Shares: {data.shares_balance}</p>
          <p>Share Unit Price: {data.share_unit_price}</p>
          <p>Total Share Value: {data.total_share_value}</p>

          {data.active_loan ? (
            <>
              <h3>Active Loan</h3>
              <p>Amount: {data.active_loan.amount}</p>
              <p>Total Repayment: {data.active_loan.total_repayment}</p>
              <p>Total Repaid: {data.active_loan.total_repaid}</p>
              <p>Remaining Balance: {data.active_loan.remaining_balance}</p>
              <p>Status: {data.active_loan.status}</p>
              <p>Purpose: {data.active_loan.purpose}</p>
            </>
          ) : (
            <p>Active Loan: None</p>
          )}

          {data.recent_repayments && data.recent_repayments.length > 0 ? (
            <>
              <h3>Recent Repayments</h3>
              {data.recent_repayments.map((repayment: any) => (
                <div
                  key={repayment.id}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p>Amount: {repayment.amount}</p>
                  <p>Date: {repayment.payment_date}</p>
                  <p>Notes: {repayment.notes || "-"}</p>
                </div>
              ))}
            </>
          ) : (
            <p>No recent repayments.</p>
          )}
        </>
      ) : (
        !error && <p>Loading data...</p>
      )}
    </div>
  );
}
