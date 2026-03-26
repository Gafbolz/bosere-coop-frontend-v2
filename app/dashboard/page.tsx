"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) {
        window.location.href = "/login";
        return;
      }

      setUser(userData.user);

      const session = await supabase.auth.getSession();

      const res = await fetch(
        "https://cooperaid-finance.preview.emergentagent.com/api/dashboard/me",
        {
          headers: {
            Authorization: `Bearer ${session.data.session?.access_token}`,
          },
        }
      );

      const result = await res.json();
      setData(result);
    };

    loadUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>

      <p>Email: {user.email}</p>

      {data ? (
        <>
          <p>Name: {data.name}</p>
          <p>Savings: {data.savings}</p>
          <p>Shares: {data.shares}</p>
          <p>Share Unit Price: {data.share_unit_price}</p>
          <p>Total Share Value: {data.total_share_value}</p>
        </>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
