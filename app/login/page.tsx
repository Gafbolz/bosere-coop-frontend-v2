"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: "https://bosere-coop-frontend-v2-o917.vercel.app/dashboard",
  },
});

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for login link");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Loading..." : "Send Login Link"}
      </button>
    </div>
  );
}
