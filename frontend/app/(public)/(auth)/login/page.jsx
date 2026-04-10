"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();

  useEffect(() => { setMounted(true); }, []);

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
        if (data.roles) localStorage.setItem("roles", JSON.stringify(data.roles));
        if (data.permissions) localStorage.setItem("permissions", JSON.stringify(data.permissions));

        const roleType = data.user?.role_type || "";
        if (roleType === "") {
          setSuccess("Login successful! Redirecting...");
          login(data.token, data.user.name, data.roles, data.permissions);
          router.replace("/dashboard");
        } else {
          setError("Access denied for this role.");
          localStorage.clear();
          router.replace("/login");
        }
      } else {
        setError(data.message || "Invalid login credentials");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f7f6f3;
        }

        @media (max-width: 768px) {
          .login-root { grid-template-columns: 1fr; }
          .left-panel { display: none; }
        }

        .left-panel {
          background: #1a1a2e;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 44px 48px;
        }

        .dot-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .blob {
          position: absolute; border-radius: 50%; pointer-events: none;
        }
        .blob-1 { width:500px; height:500px; background:rgba(251,191,36,0.07); top:-200px; right:-150px; }
        .blob-2 { width:300px; height:300px; background:rgba(251,191,36,0.05); bottom:-80px; left:-60px; }

        .left-top { position: relative; z-index: 1; }

        .logo-row { display:flex; align-items:center; gap:10px; }
        .logo-mark {
          width:34px; height:34px; background:#f59e0b;
          border-radius:8px; display:flex; align-items:center; justify-content:center;
        }
        .logo-name { font-weight:800; font-size:17px; color:#fff; letter-spacing:-0.3px; }

        .left-mid { position: relative; z-index: 1; }

        .tag-pill {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.25);
          border-radius:100px; padding:6px 14px;
          font-size:11px; font-weight:600; color:#fbbf24;
          letter-spacing:0.8px; text-transform:uppercase; margin-bottom:22px;
        }
        .tag-dot { width:5px; height:5px; background:#f59e0b; border-radius:50%; }

        .left-h {
          font-size: clamp(30px, 3vw, 44px);
          font-weight:800; line-height:1.12;
          letter-spacing:-1.2px; color:#fff; margin-bottom:18px;
        }
        .left-h em { font-style:normal; color:#f59e0b; }

        .left-desc {
          font-size:14px; color:#6b7280;
          line-height:1.75; max-width:340px; margin-bottom:36px;
        }

        .feature-list { display:flex; flex-direction:column; gap:14px; }
        .feature-item { display:flex; align-items:center; gap:12px; }
        .feature-check {
          width:22px; height:22px; flex-shrink:0;
          background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.25);
          border-radius:6px; display:flex; align-items:center; justify-content:center;
        }
        .feature-text { font-size:13px; color:#9ca3af; }

        .left-bottom { position:relative; z-index:1; display:flex; gap:20px; }
        .left-bottom a { font-size:11px; color:#374151; text-decoration:none; transition:color 0.2s; }
        .left-bottom a:hover { color:#f59e0b; }

        .right-panel {
          background:#fafaf8;
          display:flex; align-items:center; justify-content:center;
          padding:48px 40px;
        }

        .form-card {
          width:100%; max-width:400px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(14px)'};
          transition: opacity 0.45s ease, transform 0.45s ease;
        }

        .form-head { margin-bottom:36px; }
        .form-eyebrow {
          font-size:11px; font-weight:700; letter-spacing:1.6px;
          text-transform:uppercase; color:#f59e0b; margin-bottom:10px;
        }
        .form-title {
          font-size:26px; font-weight:800;
          color:#111827; letter-spacing:-0.7px; margin-bottom:7px;
        }
        .form-sub { font-size:13px; color:#9ca3af; line-height:1.6; }

        .field { margin-bottom:18px; }
        .field-label {
          display:block; font-size:11px; font-weight:700;
          text-transform:uppercase; letter-spacing:0.5px;
          color:#6b7280; margin-bottom:7px;
        }
        .field-row { position:relative; }
        .field-ico {
          position:absolute; left:13px; top:50%;
          transform:translateY(-50%); color:#d1d5db;
          display:flex; pointer-events:none;
        }
        .field-input {
          width:100%; height:46px;
          background:#fff; border:1.5px solid #e5e7eb; border-radius:10px;
          padding:0 42px; font-size:14px; color:#111827;
          font-family:'Plus Jakarta Sans', sans-serif; outline:none;
          transition:border-color 0.18s, box-shadow 0.18s;
        }
        .field-input::placeholder { color:#d1d5db; }
        .field-input:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
        .field-input:hover:not(:focus) { border-color:#d1d5db; }

        .pwd-toggle {
          position:absolute; right:13px; top:50%;
          transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#d1d5db; display:flex; padding:0; transition:color 0.18s;
        }
        .pwd-toggle:hover { color:#f59e0b; }

        .field-meta { display:flex; justify-content:flex-end; margin-bottom:6px; }
        .forgot { font-size:12px; color:#f59e0b; text-decoration:none; font-weight:600; }
        .forgot:hover { opacity:0.75; }

        .submit-btn {
          width:100%; height:50px; border:none; border-radius:10px;
          background:#1a1a2e; color:#fff;
          font-family:'Plus Jakarta Sans', sans-serif;
          font-size:14px; font-weight:700; letter-spacing:0.1px;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;
          transition:transform 0.12s, box-shadow 0.18s; margin-top:6px;
          position:relative; overflow:hidden;
        }
        .submit-btn::after {
          content:''; position:absolute; inset:0;
          background:rgba(245,158,11,0.08); opacity:0; transition:opacity 0.18s;
        }
        .submit-btn:hover:not(:disabled)::after { opacity:1; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 20px rgba(26,26,46,0.2); }
        .submit-btn:active:not(:disabled) { transform:translateY(0); }
        .submit-btn:disabled { opacity:0.45; cursor:not-allowed; }

        .spinner {
          width:15px; height:15px;
          border:2px solid rgba(255,255,255,0.3); border-top-color:#f59e0b;
          border-radius:50%; animation:spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .alert {
          display:flex; align-items:flex-start; gap:9px;
          padding:11px 13px; border-radius:8px;
          font-size:13px; line-height:1.5; margin-top:14px;
        }
        .alert-error { background:#fef2f2; border:1px solid #fecaca; color:#b91c1c; }
        .alert-success { background:#f0fdf4; border:1px solid #bbf7d0; color:#15803d; }
        .alert-ico { flex-shrink:0; margin-top:1px; }

        .form-footer {
          margin-top:24px; padding-top:20px;
          border-top:1px solid #f3f4f6;
          display:flex; align-items:center; justify-content:center; gap:6px;
          font-size:11px; color:#d1d5db;
        }
      `}</style>

      <div className="login-root">

        <div className="left-panel">
          <div className="dot-pattern" />
          <div className="blob blob-1" />
          <div className="blob blob-2" />

          <div className="left-top">
            <div className="logo-row">
              <div className="logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="logo-name">AdminOS</span>
            </div>
          </div>

          <div className="left-mid">
            <div className="tag-pill">
              <span className="tag-dot" />
              Administrator Portal
            </div>
            <h1 className="left-h">
              Your command<br />centre for <em>everything</em>
            </h1>
            <p className="left-desc">
              One secure dashboard to manage users, monitor operations, and drive decisions across your entire platform.
            </p>
            <div className="feature-list">
              {["Role-based access control", "Real-time activity monitoring", "256-bit end-to-end encryption"].map((f) => (
                <div className="feature-item" key={f}>
                  <div className="feature-check">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="feature-text">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="left-bottom">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-card">
            <div className="form-head">
              <p className="form-eyebrow">Secure Access</p>
              <h2 className="form-title">Welcome back</h2>
              <p className="form-sub">Sign in to your administrator account to continue.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Email Address</label>
                <div className="field-row">
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input className="field-input" type="email" placeholder="admin@company.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="field-row">
                  <span className="field-ico">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input className="field-input" type={showPassword ? "text" : "password"}
                    placeholder="••••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                  <button type="button" className="pwd-toggle" onClick={() => setShowPassword(!showPassword)}
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

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><span className="spinner" />Authenticating...</>
                ) : (
                  <>Sign In to Dashboard
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>

              {error && (
                <div className="alert alert-error" role="alert">
                  <span className="alert-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </span>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  <span className="alert-ico">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  {success}
                </div>
              )}
            </form>

            <div className="form-footer">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Protected by 256-bit SSL encryption
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
