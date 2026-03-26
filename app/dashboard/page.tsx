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
          setError(result?.detail || result?.message || text || "Failed to load dashboard data.");
          return;
        }

        setData(result);
      } catch (err: any) {
        setError(err?.message || "Something went wrong while loading dashboard.");
      }
    };

    loadUser();
  }, []);

  if (!user) {
    return <p style={{ padding: 20 }}>Loading user...</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Email: {user.email}</p>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data ? (
        <>
          <p>Name: {data.full_name}</p>
          <p>Savings: {data.savings_balance}</p>
          <p>Shares: {data.shares_balance}</p>
          <p>Share Unit Price: {data.share_unit_price}</p>
          <p>Total Share Value: {data.total_share_value}</p>
        </>
      ) : (
        !error && <p>Loading data...</p>
      )}
    </div>
  );
}
