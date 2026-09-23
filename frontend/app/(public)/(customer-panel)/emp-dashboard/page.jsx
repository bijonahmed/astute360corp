"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  autoComplete = "new-password",
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="emp-field">
      <label className="emp-field-label">{label}</label>
      <div className="emp-field-row">
        <span className="emp-field-ico">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <input
          className="emp-field-input"
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="emp-pwd-toggle"
          onClick={() => setShow(!show)}
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? (
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
  );
}

export default function EmpDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [userdata, setUserdata] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    newPassword_confirmation: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const base = "Employee Dashboard";
    document.title = userdata?.name ? `${base} — ${userdata.name}` : base;
  }, [userdata]);

  useEffect(() => {
    if (!token) {
      router.replace("/emp-login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.status === 401) {
          ["token", "username", "roles", "permissions", "user"].forEach((k) =>
            localStorage.removeItem(k)
          );
          router.replace("/emp-login");
          return;
        }
        if (res.ok) {
          setUserdata(data.user);
        } else {
          console.error("Auth error:", data.message);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/updateCustomerProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userdata),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        window.location.reload();
      } else {
        const msg = data.errors
          ? Object.values(data.errors).flat()[0]
          : data.message;
        toast.error(msg || "Failed to update profile");
      }
    } catch (err) {
      toast.error("API error: " + err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitChatPassword = async (e) => {
    e.preventDefault();

    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/customerChangePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            newPassword_confirmation: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          newPassword_confirmation: "",
        });
      } else {
        const msg = data.errors
          ? Object.values(data.errors).flat()[0]
          : data.message;
        toast.error(msg || "Failed to update password");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = userdata?.name
    ? userdata.name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <main className={`emp-dash ${mounted ? "is-on" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .emp-dash {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background:#f1f5f9;
          min-height:70vh;
          padding-bottom:64px;
        }
        .emp-dash * { box-sizing:border-box; margin:0; padding:0; }

        .emp-dash-wrap { max-width:1200px; margin:0 auto; padding:0 24px; }

        .emp-dash-crumbs {
          background:#fff; border-bottom:1px solid #e5e7eb;
          padding:14px 0; font-size:13px; color:#9ca3af;
        }
        .emp-dash-crumbs a { color:#6b7280; text-decoration:none; font-weight:600; transition:color .15s; }
        .emp-dash-crumbs a:hover { color:#0284c7; }
        .emp-dash-crumbs .sep { margin:0 8px; color:#d1d5db; }
        .emp-dash-crumbs strong { color:#111827; font-weight:700; }

        .emp-dash-body { padding-top:32px; }

        .emp-dash-grid {
          display:grid;
          grid-template-columns:280px 1fr;
          gap:24px;
          align-items:start;
        }
        @media (max-width: 991px) {
          .emp-dash-grid { grid-template-columns:1fr; }
        }

        .emp-dash-side, .emp-hero, .emp-card, .emp-loading {
          opacity:0; transform:translateY(14px);
          transition:opacity .45s ease, transform .45s ease;
        }
        .emp-dash.is-on .emp-dash-side { opacity:1; transform:none; }
        .emp-dash.is-on .emp-hero { opacity:1; transform:none; transition-delay:.06s; }
        .emp-dash.is-on .emp-loading,
        .emp-dash.is-on .emp-card { opacity:1; transform:none; transition-delay:.12s; }

        .emp-hero {
          background:#0f172a;
          border-radius:16px;
          padding:28px 30px;
          display:flex; align-items:center; gap:20px;
          position:relative; overflow:hidden;
          margin-bottom:24px;
        }
        .emp-hero::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size:24px 24px; pointer-events:none;
        }
        .emp-hero::after {
          content:''; position:absolute; width:280px; height:280px;
          background:rgba(56,189,248,0.1); border-radius:50%;
          top:-140px; right:-80px; pointer-events:none;
        }
        .emp-hero-avatar {
          width:64px; height:64px; flex-shrink:0;
          background:linear-gradient(135deg, #38bdf8, #0284c7);
          border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          font-size:22px; font-weight:800; color:#0f172a;
          position:relative; z-index:1;
        }
        .emp-hero-info { position:relative; z-index:1; flex:1; min-width:0; }
        .emp-hero-info h1 {
          font-size:20px; font-weight:800; color:#fff;
          letter-spacing:-0.4px; margin-bottom:3px;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .emp-hero-info p { font-size:13px; color:#94a3b8; }
        .emp-hero-badge {
          position:relative; z-index:1;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          color:#7dd3fc; font-size:11px; font-weight:700;
          letter-spacing:0.8px; text-transform:uppercase;
          padding:6px 14px; border-radius:100px;
        }
        @media (max-width: 576px) {
          .emp-hero { flex-wrap:wrap; padding:22px; }
          .emp-hero-badge { order:3; }
        }

        .emp-loading {
          background:#fff; border:1.5px solid #e5e7eb; border-radius:16px;
          padding:56px 24px; text-align:center;
          font-size:13px; color:#9ca3af; font-weight:600;
        }
        .emp-loading .emp-spinner {
          width:26px; height:26px; margin:0 auto 14px;
          border:3px solid #e5e7eb; border-top-color:#0284c7;
          border-radius:50%; animation:empDashSpin .7s linear infinite;
        }
        @keyframes empDashSpin { to { transform:rotate(360deg); } }

        .emp-cards {
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(340px, 1fr));
          gap:24px;
        }

        .emp-card {
          background:#fff; border:1.5px solid #e5e7eb; border-radius:16px;
          padding:28px;
        }
        .emp-card-head {
          display:flex; align-items:center; gap:12px;
          margin-bottom:24px; padding-bottom:18px;
          border-bottom:1px solid #f3f4f6;
        }
        .emp-card-ico {
          width:38px; height:38px; flex-shrink:0;
          background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.22);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          color:#0284c7;
        }
        .emp-card-head h2 { font-size:16px; font-weight:800; color:#111827; letter-spacing:-0.3px; }
        .emp-card-head p { font-size:12px; color:#9ca3af; margin-top:2px; }

        .emp-field { margin-bottom:16px; }
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
          transition:border-color .18s, box-shadow .18s;
        }
        .emp-field-input::placeholder { color:#d1d5db; }
        .emp-field-input:focus { border-color:#38bdf8; box-shadow:0 0 0 3px rgba(56,189,248,0.12); }
        .emp-field-input:hover:not(:focus) { border-color:#d1d5db; }

        .emp-pwd-toggle {
          position:absolute; right:13px; top:50%;
          transform:translateY(-50%);
          background:none; border:none; cursor:pointer;
          color:#d1d5db; display:flex; padding:0; transition:color .18s;
        }
        .emp-pwd-toggle:hover { color:#0284c7; }

        .emp-field-row-2 {
          display:grid; grid-template-columns:1fr 1fr; gap:14px;
        }
        @media (max-width: 480px) {
          .emp-field-row-2 { grid-template-columns:1fr; }
        }

        .emp-submit-btn {
          height:46px; padding:0 24px; border:none; border-radius:10px;
          background:#0f172a; color:#fff;
          font-family:'Plus Jakarta Sans', sans-serif;
          font-size:13px; font-weight:700;
          cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px;
          transition:transform .12s, box-shadow .18s; margin-top:6px;
        }
        .emp-submit-btn:hover:not(:disabled) {
          transform:translateY(-1px); box-shadow:0 6px 18px rgba(15,23,42,0.18);
        }
        .emp-submit-btn:active:not(:disabled) { transform:translateY(0); }
        .emp-submit-btn:disabled { opacity:.45; cursor:not-allowed; }

        .emp-btn-spinner {
          width:14px; height:14px;
          border:2px solid rgba(255,255,255,0.3); border-top-color:#38bdf8;
          border-radius:50%; animation:empDashSpin .6s linear infinite;
        }

        .emp-note {
          font-size:12px; color:#9ca3af; line-height:1.6; margin-top:14px;
        }
      `}</style>

      <Toaster position="top-right" />

      <div className="emp-dash-crumbs">
        <div className="emp-dash-wrap">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <strong>Employee Dashboard</strong>
        </div>
      </div>

      <div className="emp-dash-wrap emp-dash-body">
        <div className="emp-dash-grid">
          <div className="emp-dash-side">
            <Sidebar />
          </div>

          <div className="emp-dash-main">
            <section className="emp-hero">
              <div className="emp-hero-avatar">
                {initials || (
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
              <div className="emp-hero-info">
                <h1>{userdata?.name || (loading ? "Loading..." : "Employee")}</h1>
                <p>{userdata?.email || ""}</p>
              </div>
              <span className="emp-hero-badge">Employee</span>
            </section>

            {loading ? (
              <div className="emp-loading">
                <div className="emp-spinner" />
                Loading your profile...
              </div>
            ) : (
              <div className="emp-cards">
                <form className="emp-card" onSubmit={handleSubmit}>
                  <div className="emp-card-head">
                    <div className="emp-card-ico">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <h2>Profile Information</h2>
                      <p>Update your personal details</p>
                    </div>
                  </div>

                  <div className="emp-field">
                    <label className="emp-field-label">Full Name</label>
                    <div className="emp-field-row">
                      <span className="emp-field-ico">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </span>
                      <input
                        className="emp-field-input"
                        type="text"
                        placeholder="Please enter your name..."
                        value={userdata?.name || ""}
                        onChange={(e) =>
                          setUserdata({ ...userdata, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="emp-field-row-1">
                    <div className="emp-field">
                      <label className="emp-field-label">Phone Number</label>
                      <div className="emp-field-row">
                        <span className="emp-field-ico">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <input
                          className="emp-field-input"
                          type="text"
                          placeholder="Phone number..."
                          value={userdata?.phone_number || ""}
                          onChange={(e) =>
                            setUserdata({
                              ...userdata,
                              phone_number: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="emp-field">
                      <label className="emp-field-label">Email</label>
                      <div className="emp-field-row">
                        <span className="emp-field-ico">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <input
                          className="emp-field-input"
                          type="email"
                          placeholder="Email address..."
                          value={userdata?.email || ""}
                          onChange={(e) =>
                            setUserdata({
                              ...userdata,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="emp-submit-btn"
                    disabled={savingProfile}
                  >
                    {savingProfile ? (
                      <>
                        <span className="emp-btn-spinner" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </form>

                <form className="emp-card" onSubmit={handleSubmitChatPassword}>
                  <div className="emp-card-head">
                    <div className="emp-card-ico">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div>
                      <h2>Change Password</h2>
                      <p>Keep your account secure</p>
                    </div>
                  </div>

                  <PasswordField
                    label="Current Password"
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    autoComplete="current-password"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                  />

                  <PasswordField
                    label="New Password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        newPassword: e.target.value,
                      })
                    }
                  />

                  <PasswordField
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                        newPassword_confirmation: e.target.value,
                      })
                    }
                  />

                  <button
                    type="submit"
                    className="emp-submit-btn"
                    disabled={savingPassword}
                  >
                    {savingPassword ? (
                      <>
                        <span className="emp-btn-spinner" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>

                  <p className="emp-note">
                    Password must be at least 6 characters long.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
