"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useEffect, useState } from "react";

export default function EmpLoginPage() {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user && data.user.role_type == 2) {
          setSuccess("Login successful!");
          login(data.token, data.user.name);
          window.location.href = "/emp-dashboard";
        } else {
          setError("Invalid login — not allowed.");
        }
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .emp-login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f7f6f3;
        }

        @media (max-width: 768px) {
          .emp-login-root { grid-template-columns: 1fr; }
          .emp-left-panel { display: none; }
        }

        .emp-left-panel {
          background: #0f172a;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px 48px;
        }

        .emp-dot-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .emp-blob { position: absolute; border-radius: 50%; pointer-events: none; }
        .emp-blob-1 { width:500px; height:500px; background:rgba(56,189,248,0.08); top:-200px; right:-150px; }
        .emp-blob-2 { width:300px; height:300px; background:rgba(56,189,248,0.06); bottom:-80px; left:-60px; }

        .emp-left-top { position: relative; z-index: 1; }

        .emp-logo-row { display:flex; align-items:center; gap:10px; }
        .emp-logo-mark {
          width:34px; height:34px; background:#38bdf8;
          border-radius:8px; display:flex; align-items:center; justify-content:center;
        }
        .emp-logo-name { font-weight:800; font-size:17px; color:#fff; letter-spacing:-0.3px; }

        .emp-left-mid { position: relative; z-index: 1; }

        .emp-tag-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.25);
          border-radius:100px; padding:6px 14px;
          font-size:11px; font-weight:600; color:#7dd3fc;
          letter-spacing:0.8px; text-transform:uppercase; margin-bottom:22px;
        }
        .emp-tag-dot { width:5px; height:5px; background:#38bdf8; border-radius:50%; }

        .emp-left-h {
          font-size: clamp(30px, 3vw, 44px);
          font-weight:800; line-height:1.12;
          letter-spacing:-1.2px; color:#fff; margin-bottom:18px;
        }
        .emp-left-h em { font-style:normal; color:#38bdf8; }

        .emp-left-desc {
          font-size:14px; color:#64748b;
          line-height:1.75; max-width:340px; margin-bottom:36px;
        }

        .emp-feature-list { display:flex; flex-direction:column; gap:14px; }
        .emp-feature-item { display:flex; align-items:center; gap:12px; }
        .emp-feature-check {
          width:22px; height:22px; flex-shrink:0;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.25);
          border-radius:6px; display:flex; align-items:center; justify-content:center;
        }
        .emp-feature-text { font-size:13px; color:#94a3b8; }

        .emp-left-bottom { position:relative; z-index:1; display:flex; gap:20px; }
        .emp-left-bottom a { font-size:11px; color:#475569; text-decoration:none; transition:color 0.2s; }
        .emp-left-bottom a:hover { color:#38bdf8; }

        .emp-right-panel {
          background:#fafaf8;
          display:flex; align-items:center; justify-content:center;
          padding:48px 40px;
        }

        .emp-form-card {
          width:100%; max-width:400px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(14px)'};
          transition: opacity 0.45s ease, transform 0.45s ease;
        }

        .emp-form-head { margin-bottom:36px; }
        .emp-form-eyebrow {
          font-size:11px; font-weight:700; letter-spacing:1.6px;
          text-transform:uppercase; color:#0284c7; margin-bottom:10px;
        }
        .emp-form-title {
          font-size:26px; font-weight:800;
          color:#111827; letter-spacing:-0.7px; margin-bottom:7px;
        }
        .emp-form-sub { font-size:13px; color:#9ca3af; line-height:1.6; }

        .emp-field { margin-bottom:18px; }
        .emp-field-label {
          display:block; font-size:11px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.5px;
          color:#6b7280; margin-bottom:7px;
        }
        .emp-field-row { position:relative; }
        .emp-field-ico {
          position:absolute; left:13px; top:50%;
          transform:translateY(-50%); color:#d1d5db;
          display:flex; pointer-events:none;
        }
        .emp-field-input {
          width:100%; height:46px;
          background:#fff; border:1.5px solid #e5e7eb; border-radius:10px;
          padding:0 42px; font-size:14px; color:#111827;
          font-family:'Plus Jakarta Sans', sans-serif; outline:none;
          transition:border-color 0.18s, box-shadow 0.18s;
        }
        .emp-field-input::placeholder { color:#d1d5db; }
        .emp-field-input:focus { border-color:#38bdf8; box-shadow:0 0 0 3px rgba(56,189,248,0.12); }
        .emp-field-input:hover:not(:focus) { border-color:#d1d5db; }

        .emp-pwd-toggle {
          position:absolute; right:13px; top:50%;
          transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#d1d5db; display:flex; padding:0; transition:color 0.18s;
        }
        .emp-pwd-toggle:hover { color:#0284c7; }

        .emp-submit-btn {
          width:100%; height:50px; border:none; border-radius:10px;
          background:#0f172a; color:#fff;
          font-family:'Plus Jakarta Sans', sans-serif;
          font-size:14px; font-weight:700; letter-spacing:0.1px;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
          transition:transform 0.12s, box-shadow 0.18s; margin-top:6px;
          position:relative; overflow:hidden;
        }
        .emp-submit-btn::after {
          content:''; position:absolute; inset:0;
          background:rgba(56,189,248,0.1); opacity:0; transition:opacity 0.18s;
        }
        .emp-submit-btn:hover:not(:disabled)::after { opacity:1; }
        .emp-submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(15,23,42,0.2); }
        .emp-submit-btn:active:not(:disabled) { transform:translateY(0); }
        .emp-submit-btn:disabled { opacity:0.45; cursor:not-allowed; }

        .emp-spinner {
          width:15px; height:15px;
          border:2px solid rgba(255,255,255,0.3); border-top-color:#38bdf8;
          border-radius:50%; animation:empspin 0.6s linear infinite;
        }
        @keyframes empspin { to { transform: rotate(360deg); } }

        .emp-alert {
          display:flex; align-items:flex-start; gap:9px;
          padding:11px 13px; border-radius:8px;
          font-size:13px; line-height:1.5; margin-top:14px;
        }
        .emp-alert-error { background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; }
        .emp-alert-success { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; }
        .emp-alert-ico { flex-shrink:0; margin-top:1px; }

        .emp-form-footer {
          margin-top:24px; padding-top:20px;
          border-top:1px solid #f3f4f6;
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-size:12px; color:#9ca3af;
        }
        .emp-form-footer a { color:#0284c7; font-weight:600; text-decoration:none; }
        .emp-form-footer a:hover { opacity:0.75; }
      `}</style>

      <div className="emp-login-root">

        <div className="emp-left-panel">
          <div className="emp-dot-pattern" />
          <div className="emp-blob emp-blob-1" />
          <div className="emp-blob emp-blob-2" />

          <div className="emp-left-top">
            <div className="emp-logo-row">
              <div className="emp-logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="emp-logo-name">Astute360</span>
            </div>
          </div>

          <div className="emp-left-mid">
            <div className="emp-tag-pill">
              <span className="emp-tag-dot" />
              Employee Portal
            </div>
            <h1 className="emp-left-h">
              Your workplace,<br />at your <em>fingertips</em>
            </h1>
            <p className="emp-left-desc">
              Access your payslips, projects, and personal records — all from one secure employee dashboard.
            </p>
            <div className="emp-feature-list">
              {["Payslips & salary history", "Project assignments & updates", "Secure employee-only access"].map((f) => (
                <div className="emp-feature-item" key={f}>
                  <div className="emp-feature-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="emp-feature-text">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="emp-left-bottom">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>

        <div className="emp-right-panel">
          <div className="emp-form-card">
            <div className="emp-form-head">
              <p className="emp-form-eyebrow">Employee Access</p>
              <h2 className="emp-form-title">Welcome back</h2>
              <p className="emp-form-sub">Sign in with your employee email to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="emp-field">
                <label className="emp-field-label">Email Address</label>
                <div className="emp-field-row">
                  <span className="emp-field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input className="emp-field-input" type="email" placeholder="employee@company.com"
                    value={email} onChange={(e) => setemail(e.target.value)} required autoComplete="email" />
                </div>
              </div>

              <div className="emp-field">
                <label className="emp-field-label">Password</label>
                <div className="emp-field-row">
                  <span className="emp-field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input className="emp-field-input" type={showPassword ? "text" : "password"}
                    placeholder="••••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="emp-pwd-toggle" onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1} aria-label={showPassword ? "Hide password" : "Show password"}>
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="emp-submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="emp-spinner" />Signing in...</>
                ) : (
                  <>Sign In to Employee Portal
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>

              {error && (
                <div className="emp-alert emp-alert-error" role="alert">
                  <span className="emp-alert-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                  {error}
                </div>
              )}

              {success && (
                <div className="emp-alert emp-alert-success" role="alert">
                  <span className="emp-alert-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {success}
                </div>
              )}
            </form>

         
          </div>
        </div>

      </div>
    </>
  );
}
