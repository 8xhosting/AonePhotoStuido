"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../../admin.css";

/**
 * /admin/login — mobile + password sign-in.
 * On first run (no admin accounts exist) this becomes the one-time
 * setup screen that creates the owner (super admin) account.
 */
export default function LoginPage() {
  const router = useRouter();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Already signed in? go straight to the dashboard
        const me = await fetch("/api/admin/me", { cache: "no-store" });
        if (me.ok) {
          router.replace("/admin");
          return;
        }
        const res = await fetch("/api/admin/login", { cache: "no-store" });
        const json = await res.json();
        setNeedsSetup(!!json.needsSetup);
      } catch {
        setNeedsSetup(false);
      } finally {
        setReady(true);
      }
    })();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(needsSetup ? { name, mobile, password } : { mobile, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <div className="brand">
          <b>AOne</b>
          <small>PHOTO STUDIO</small>
        </div>
        <div className="script">Studio Admin</div>
        <p className="sub">
          {needsSetup
            ? "Welcome! Create the owner account to secure your dashboard."
            : "Sign in with your mobile number and password."}
        </p>

        {ready ? (
          <form onSubmit={submit}>
            {error && <div className="err">{error}</div>}
            {needsSetup && (
              <div className="field">
                <label>
                  Your Name <em>*</em>
                </label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Owner name" required />
              </div>
            )}
            <div className="field">
              <label>
                Mobile Number <em>*</em>
              </label>
              <input
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/[^\d]/g, "").slice(0, 12))}
                placeholder="10-digit mobile number"
                required
              />
            </div>
            <div className="field">
              <label>
                Password <em>*</em>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={needsSetup ? "Choose a strong password" : "Your password"}
                required
              />
            </div>
            <button className="admBtn primary" disabled={busy} style={{ width: "100%", padding: 13 }}>
              {busy ? "Please wait…" : needsSetup ? "Create Owner Account →" : "Sign In →"}
            </button>
          </form>
        ) : (
          <p className="note">Loading…</p>
        )}

        <p className="note">
          {needsSetup
            ? "This screen appears only once — the first account becomes the Super Admin. Keep the password safe."
            : "Sessions last 7 days. Forgot the password? Another super admin can reset it from Settings → Admin Users."}
        </p>
      </div>
    </div>
  );
}
