"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "../../emp-dashboard/sidebar";

export default function PaySlipView({ id }) {
  const { token } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.title = "View Payslip";
  }, []);

  const getApiBase = () =>
    (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

  const getFileExt = (path = "") => {
    const clean = (path || "").split("?")[0].split("#")[0];
    const parts = clean.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  const isPdfFile = (url = "") => getFileExt(url) === "pdf";
  const isImageFile = (url = "") =>
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(getFileExt(url));

  const getFileName = (path) => (!path ? "-" : path.split("/").pop());

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return d;
    }
  };

  const logoutToLogin = () => {
    ["token", "username", "roles", "permissions", "user"].forEach((k) =>
      localStorage.removeItem(k)
    );
    router.replace("/emp-login");
  };

  useEffect(() => {
    if (!token) {
      router.replace("/emp-login");
      return;
    }
    if (!id) {
      setLoading(false);
      setError("No payslip selected.");
      return;
    }

    let cancelled = false;

    const fetchRow = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${getApiBase()}/emplpayslip/chkrow/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          logoutToLogin();
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to load payslip");
        }
        if (!cancelled) setRow(data.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Something went wrong!");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRow();
    return () => {
      cancelled = true;
    };
  }, [id, token, router]);

  useEffect(() => {
    if (!row || !showPreview) return;

    let cancelled = false;
    let url = "";

    const loadPreview = async () => {
      const path = row.payslip || "";
      if (!path) {
        setPreviewError("failed");
        return;
      }
      if (!isPdfFile(path) && !isImageFile(path)) {
        setPreviewError("unsupported");
        return;
      }

      setPreviewLoading(true);
      setPreviewError("");
      try {
        const res = await fetch(`${getApiBase()}/emplpayslip/stream/${row.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Could not load file");
        const blob = await res.blob();
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        if (!cancelled) setPreviewError("failed");
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [row, token, showPreview]);

  const openDownload = async () => {
    if (!row) return;
    try {
      const res = await fetch(`${getApiBase()}/emplpayslip/stream/${row.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not load file");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getFileName(row.payslip) || "payslip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const emp = row?.employee;
  const empDept = emp?.department?.name || "-";
  const empDesig = emp?.designation?.name || "-";

  return (
    <main className={`emp-pv ${mounted ? "is-on" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .emp-pv {
          font-family:'Plus Jakarta Sans', sans-serif;
          background:#f1f5f9;
          min-height:70vh;
          padding-bottom:48px;
          overflow-x:hidden;
          overflow-x:clip;
        }
        .emp-pv * { box-sizing:border-box; margin:0; padding:0; }
        .emp-pv img, .emp-pv iframe { max-width:100%; }

        .emp-pv-wrap { max-width:1200px; margin:0 auto; padding:0 16px; }
        @media (min-width: 576px) { .emp-pv-wrap { padding:0 24px; } }

        .emp-pv-crumbs {
          background:#fff; border-bottom:1px solid #e5e7eb;
          padding:12px 0; font-size:12.5px; color:#9ca3af;
        }
        @media (min-width: 576px) { .emp-pv-crumbs { padding:14px 0; font-size:13px; } }
        .emp-pv-crumbs .emp-pv-wrap {
          display:flex; flex-wrap:wrap; align-items:center; gap:2px 0;
        }
        .emp-pv-crumbs a { color:#6b7280; text-decoration:none; font-weight:600; transition:color .15s; }
        .emp-pv-crumbs a:hover { color:#0284c7; }
        .emp-pv-crumbs .sep { margin:0 8px; color:#d1d5db; }
        .emp-pv-crumbs strong { color:#111827; font-weight:700; }

        .emp-pv-body { padding-top:20px; }
        @media (min-width: 768px) { .emp-pv-body { padding-top:32px; } }

        .emp-pv-grid {
          display:grid;
          grid-template-columns:minmax(0, 1fr);
          gap:20px;
          align-items:start;
        }
        .emp-pv-grid > * { min-width:0; }
        .emp-pv-main { min-width:0; }
        @media (min-width: 992px) {
          .emp-pv-grid { grid-template-columns:280px minmax(0, 1fr); gap:24px; }
        }

        .emp-pv-side, .emp-pv-hero, .emp-pv-card {
          opacity:0; transform:translateY(14px);
          transition:opacity .45s ease, transform .45s ease;
        }
        .emp-pv.is-on .emp-pv-side { opacity:1; transform:none; }
        .emp-pv.is-on .emp-pv-hero { opacity:1; transform:none; transition-delay:.06s; }
        .emp-pv.is-on .emp-pv-card { opacity:1; transform:none; transition-delay:.12s; }

        .emp-pv-hero {
          background:#0f172a;
          border-radius:14px;
          padding:18px;
          display:flex; align-items:center; justify-content:space-between;
          gap:14px; flex-wrap:wrap;
          position:relative; overflow:hidden;
          margin-bottom:20px;
        }
        @media (min-width: 576px) {
          .emp-pv-hero { padding:24px 30px; border-radius:16px; margin-bottom:24px; }
        }
        .emp-pv-hero::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size:24px 24px; pointer-events:none;
        }
        .emp-pv-hero::after {
          content:''; position:absolute; width:280px; height:280px;
          background:rgba(56,189,248,0.1); border-radius:50%;
          top:-140px; right:-80px; pointer-events:none;
        }
        .emp-pv-hero-left { position:relative; z-index:1; flex:1 1 180px; min-width:0; }
        .emp-pv-hero-tag {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          color:#7dd3fc; font-size:10px; font-weight:700;
          letter-spacing:0.8px; text-transform:uppercase;
          padding:4px 12px; border-radius:100px; margin-bottom:10px;
        }
        .emp-pv-hero-tag .dot { width:5px; height:5px; background:#38bdf8; border-radius:50%; }
        .emp-pv-hero h1 {
          font-size:19px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:4px;
        }
        @media (min-width: 576px) { .emp-pv-hero h1 { font-size:22px; } }
        .emp-pv-hero p {
          font-size:12.5px; color:#94a3b8;
          line-height:1.6; word-break:break-word;
        }
        @media (min-width: 576px) { .emp-pv-hero p { font-size:13px; } }
        .emp-pv-back-pill {
          position:relative; z-index:1; flex:0 0 auto;
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          color:#7dd3fc; font-size:12px; font-weight:700;
          padding:9px 16px; border-radius:100px;
          text-decoration:none; transition:background .15s;
          min-height:40px;
        }
        .emp-pv-back-pill:hover { background:rgba(56,189,248,0.2); color:#fff; }

        .emp-pv-card {
          background:#fff; border:1.5px solid #e5e7eb; border-radius:14px;
          overflow:hidden;
        }
        @media (min-width: 576px) { .emp-pv-card { border-radius:16px; } }
        .emp-pv-card-head {
          display:flex; align-items:center; gap:12px;
          padding:16px; border-bottom:1px solid #f3f4f6;
          flex-wrap:wrap;
        }
        @media (min-width: 576px) { .emp-pv-card-head { padding:20px 24px; } }
        .emp-pv-card-ico {
          width:38px; height:38px; flex-shrink:0;
          background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.22);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          color:#0284c7;
        }
        .emp-pv-card-head h2 { font-size:15px; font-weight:800; color:#111827; letter-spacing:-0.3px; }
        @media (min-width: 576px) { .emp-pv-card-head h2 { font-size:16px; } }
        .emp-pv-card-head p { font-size:12px; color:#9ca3af; margin-top:2px; }

        .emp-pv-meta {
          display:grid;
          grid-template-columns:repeat(auto-fit, minmax(min(140px, 100%), 1fr));
          gap:12px;
          padding:16px;
          border-bottom:1px solid #f3f4f6;
          background:#f8fafc;
        }
        @media (min-width: 576px) { .emp-pv-meta { padding:18px 24px; gap:14px; } }
        .emp-pv-meta-item { min-width:0; }
        .emp-pv-meta-item span {
          display:block; font-size:10px; font-weight:700;
          letter-spacing:0.6px; text-transform:uppercase;
          color:#94a3b8; margin-bottom:4px;
        }
        .emp-pv-meta-item b {
          display:block; font-size:13.5px; font-weight:700; color:#0f172a;
          word-break:break-word; line-height:1.45;
        }
        .emp-pv .emp-ps-ext {
          font-size:10px; font-weight:800; letter-spacing:0.5px;
          padding:3px 8px; border-radius:6px; text-transform:uppercase;
        }
        .emp-pv .emp-ps-ext.pdf { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
        .emp-pv .emp-ps-ext.img { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }

        .emp-pv-preview {
          padding:14px;
          background:#f1f5f9;
        }
        @media (min-width: 576px) { .emp-pv-preview { padding:20px 24px; } }
        .emp-pv-frame {
          width:100%;
          height:55vh; height:55dvh;
          min-height:300px;
          border:1.5px solid #e5e7eb; border-radius:12px;
          background:#fff; display:block;
          overflow:auto;
          -webkit-overflow-scrolling:touch;
        }
        @media (min-width: 768px) { .emp-pv-frame { height:65vh; height:65dvh; } }
        .emp-pv-preview img {
          max-width:100%; height:auto;
          border:1.5px solid #e5e7eb; border-radius:12px;
          display:block; margin:0 auto; background:#fff;
        }
        .emp-pv-msg {
          text-align:center; padding:44px 16px;
          background:#fff; border:1.5px solid #e5e7eb; border-radius:12px;
        }
        .emp-pv-msg svg { color:#cbd5e1; margin-bottom:12px; }
        .emp-pv-msg b { display:block; color:#334155; font-size:15px; margin-bottom:6px; word-break:break-all; }
        .emp-pv-msg p { font-size:13px; color:#94a3b8; line-height:1.6; }
        .emp-pv-spinner {
          width:26px; height:26px; margin:0 auto 14px;
          border:3px solid #e5e7eb; border-top-color:#0284c7;
          border-radius:50%; animation:empPvSpin .7s linear infinite;
        }
        @keyframes empPvSpin { to { transform:rotate(360deg); } }

        .emp-pv-state {
          padding:48px 16px; text-align:center;
          font-size:13.5px; color:#9ca3af; font-weight:600; line-height:1.6;
        }
        @media (min-width: 576px) { .emp-pv-state { padding:64px 24px; } }
        .emp-pv-state svg { display:block; margin:0 auto 14px; color:#cbd5e1; }
        .emp-pv-state b { display:block; color:#334155; font-size:15px; margin-bottom:6px; }
        .emp-pv-state.is-error svg { color:#f59e0b; }

        .emp-pv-actions {
          display:flex; flex-direction:column; gap:10px;
          padding:14px 16px; border-top:1px solid #f3f4f6;
          background:#fff;
        }
        @media (min-width: 576px) {
          .emp-pv-actions {
            flex-direction:row; justify-content:flex-end;
            padding:16px 24px;
          }
        }
        .emp-pv-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:7px;
          height:44px; padding:0 20px; border-radius:10px;
          font-size:13.5px; font-weight:700; cursor:pointer;
          font-family:'Plus Jakarta Sans', sans-serif;
          text-decoration:none;
          transition:transform .12s, box-shadow .15s, background .15s;
          border:1.5px solid transparent;
        }
        @media (min-width: 576px) { .emp-pv-btn { height:40px; } }
        .emp-pv-btn svg { flex-shrink:0; }
        .emp-pv-btn-dl { background:#0f172a; color:#fff; }
        .emp-pv-btn-dl:hover { box-shadow:0 4px 14px rgba(15,23,42,0.2); transform:translateY(-1px); }
        .emp-pv-btn-back { background:#fff; border-color:#e5e7eb; color:#6b7280; }
        .emp-pv-btn-back:hover { background:#f9fafb; border-color:#d1d5db; }
        .emp-pv-btn-view { background:#0284c7; color:#fff; }
        .emp-pv-btn-view:hover { box-shadow:0 4px 14px rgba(2,132,199,0.25); transform:translateY(-1px); }
        .emp-pv-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
      `}</style>

      <div className="emp-pv-crumbs">
        <div className="emp-pv-wrap">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/emp-dashboard">Dashboard</Link>
          <span className="sep">/</span>
          <Link href="/payslip">My Payslips</Link>
          <span className="sep">/</span>
          <strong>View</strong>
        </div>
      </div>

      <div className="emp-pv-wrap emp-pv-body">
        <div className="emp-pv-grid">
          <div className="emp-pv-side">
            <Sidebar />
          </div>

          <div className="emp-pv-main">
            <section className="emp-pv-hero">
              <div className="emp-pv-hero-left">
                <div className="emp-pv-hero-tag">
                  <span className="dot" />
                  Employee Portal
                </div>
                <h1>Payslip Details</h1>
                <p>
                  {row?.selected_date
                    ? `Pay period — ${formatDate(row.selected_date)}`
                    : "Preview and download your payslip"}
                </p>
              </div>
              <Link href="/payslip" className="emp-pv-back-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to List
              </Link>
            </section>

            <div className="emp-pv-card">
              <div className="emp-pv-card-head">
                <div className="emp-pv-card-ico">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <h2>
                    {row?.payslip ? getFileName(row.payslip) : "Payslip File"}
                  </h2>
                  <p>
                    {row?.selected_date
                      ? formatDate(row.selected_date)
                      : "Loading payslip..."}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="emp-pv-state">
                  <div className="emp-pv-spinner" />
                  Loading payslip...
                </div>
              ) : error ? (
                <div className="emp-pv-state is-error">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  <b>Payslip not available</b>
                  {error}
                </div>
              ) : row ? (
                <>
                  <div className="emp-pv-meta">
                    <div className="emp-pv-meta-item">
                      <span>Pay Period</span>
                      <b>{formatDate(row.selected_date)}</b>
                    </div>
                    <div className="emp-pv-meta-item">
                      <span>Employee</span>
                      <b>{emp?.name || "-"}</b>
                    </div>
                    <div className="emp-pv-meta-item">
                      <span>Employee Code</span>
                      <b>{emp?.employee_code || "-"}</b>
                    </div>
                    <div className="emp-pv-meta-item">
                      <span>Department</span>
                      <b>{empDept}</b>
                    </div>
                    <div className="emp-pv-meta-item">
                      <span>Designation</span>
                      <b>{empDesig}</b>
                    </div>
                    <div className="emp-pv-meta-item">
                      <span>File</span>
                      <b>
                        <span
                          className={`emp-ps-ext ${
                            getFileExt(row.payslip) === "pdf" ? "pdf" : "img"
                          }`}
                          style={{
                            display: "inline-block",
                            marginRight: 6,
                            verticalAlign: "middle",
                          }}
                        >
                          {getFileExt(row.payslip) || "file"}
                        </span>
                        <span style={{ verticalAlign: "middle" }}>
                          {getFileName(row.payslip)}
                        </span>
                      </b>
                    </div>
                  </div>

                  {showPreview && (
                  <div className="emp-pv-preview">
                    {previewLoading ? (
                      <div className="emp-pv-msg">
                        <div className="emp-pv-spinner" />
                        <b>Loading preview...</b>
                      </div>
                    ) : previewError === "unsupported" ? (
                      <div className="emp-pv-msg">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <b>{getFileName(row.payslip)}</b>
                        <p>
                          Only PDF or image files can be previewed. Use Download
                          to open it.
                        </p>
                      </div>
                    ) : previewError === "failed" ? (
                      <div className="emp-pv-msg">
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <b>Could not load preview</b>
                        <p>Please try downloading the file instead.</p>
                      </div>
                    ) : previewUrl && isImageFile(row.payslip || previewUrl) ? (
                      <img src={previewUrl} alt={getFileName(row.payslip)} />
                    ) : previewUrl ? (
                      <iframe
                        className="emp-pv-frame"
                        src={previewUrl}
                        title={getFileName(row.payslip)}
                        type="application/pdf"
                      />
                    ) : (
                      <div className="emp-pv-msg">
                        <div className="emp-pv-spinner" />
                        <b>Preparing preview...</b>
                      </div>
                    )}
                  </div>
                  )}

                  <div className="emp-pv-actions">
                    <Link href="/payslip" className="emp-pv-btn emp-pv-btn-back">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12" />
                        <polyline points="12 19 5 12 12 5" />
                      </svg>
                      Back to My Payslips
                    </Link>
                   
                    <button
                      type="button"
                      className="emp-pv-btn emp-pv-btn-dl"
                      onClick={openDownload}
                      disabled={!row?.payslip}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download Payslip
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
