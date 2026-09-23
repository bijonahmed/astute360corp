"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../emp-dashboard/sidebar";
import { useCallback, useEffect, useState } from "react";

export default function EmpPayslipPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [accessError, setAccessError] = useState("");

  const [viewRow, setViewRow] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  const perPage = 10;

  useEffect(() => {
    setMounted(true);
    document.title = "My Payslips";
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

  const fetchData = useCallback(
    async (currentPage = 1) => {
      if (!token) return;
      setLoading(true);
      setAccessError("");
      try {
        const params = new URLSearchParams({
          page: currentPage,
          pageSize: perPage,
        });
        const res = await fetch(
          `${getApiBase()}/emplpayslip/index?${params.toString()}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 401) {
          logoutToLogin();
          return;
        }

        let result = null;
        try {
          result = await res.json();
        } catch (e) {
          result = null;
        }

        if (res.status === 403) {
          setAccessError(
            result?.message ||
              "No employee profile linked to this account. Please contact HR."
          );
          setData([]);
          setEmployee(null);
          setTotalRecords(0);
          setTotalPages(1);
          return;
        }

        if (!res.ok) {
          throw new Error(result?.message || `HTTP Error: ${res.status}`);
        }

        setEmployee(result.employee || null);
        setData(result.data || []);
        setTotalPages(result.total_pages || 1);
        setTotalRecords(result.total_records || 0);
      } catch (err) {
        console.error("Fetch payslips failed:", err.message);
        setAccessError(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!token) {
      router.replace("/emp-login");
      return;
    }
    fetchData(page);
  }, [token, page, fetchData, router]);

  const fetchFileBlob = async (row) => {
    const res = await fetch(`${getApiBase()}/emplpayslip/stream/${row.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Could not load file");
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  };

  const openView = async (row) => {
    setViewRow(row);
    setPreviewUrl("");
    setPreviewError("");
    setPreviewLoading(true);

    const pathOrUrl = row?.payslip || "";
    if (!pathOrUrl) {
      setPreviewError("failed");
      setPreviewLoading(false);
      return;
    }

    if (!isPdfFile(pathOrUrl) && !isImageFile(pathOrUrl)) {
      setPreviewError("unsupported");
      setPreviewLoading(false);
      return;
    }

    try {
      const url = await fetchFileBlob(row);
      setPreviewUrl(url);
    } catch (err) {
      setPreviewError("failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closeView = () => {
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return "";
    });
    setViewRow(null);
    setPreviewError("");
    setPreviewLoading(false);
  };

  useEffect(() => {
    return () => {
      setPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return "";
      });
    };
  }, []);

  const openDownload = async (row) => {
    try {
      const url = await fetchFileBlob(row);
      const a = document.createElement("a");
      a.href = url;
      a.download = getFileName(row?.payslip) || "payslip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <main className={`emp-ps ${mounted ? "is-on" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .emp-ps {
          font-family:'Plus Jakarta Sans', sans-serif;
          background:#f1f5f9;
          min-height:70vh;
          padding-bottom:48px;
          overflow-x:hidden;
          overflow-x:clip;
        }
        .emp-ps * { box-sizing:border-box; margin:0; padding:0; }
        .emp-ps img, .emp-ps iframe { max-width:100%; }

        .emp-ps-wrap { max-width:1200px; margin:0 auto; padding:0 16px; }
        @media (min-width: 576px) { .emp-ps-wrap { padding:0 24px; } }

        .emp-ps-crumbs {
          background:#fff; border-bottom:1px solid #e5e7eb;
          padding:12px 0; font-size:12.5px; color:#9ca3af;
        }
        @media (min-width: 576px) { .emp-ps-crumbs { padding:14px 0; font-size:13px; } }
        .emp-ps-crumbs .emp-ps-wrap {
          display:flex; flex-wrap:wrap; align-items:center; gap:2px 0;
        }
        .emp-ps-crumbs a { color:#6b7280; text-decoration:none; font-weight:600; transition:color .15s; }
        .emp-ps-crumbs a:hover { color:#0284c7; }
        .emp-ps-crumbs .sep { margin:0 8px; color:#d1d5db; }
        .emp-ps-crumbs strong { color:#111827; font-weight:700; }

        .emp-ps-body { padding-top:20px; }
        @media (min-width: 768px) { .emp-ps-body { padding-top:32px; } }

        .emp-ps-grid {
          display:grid;
          grid-template-columns:minmax(0, 1fr);
          gap:20px;
          align-items:start;
        }
        .emp-ps-grid > * { min-width:0; }
        .emp-ps-main { min-width:0; }
        @media (min-width: 992px) {
          .emp-ps-grid { grid-template-columns:280px minmax(0, 1fr); gap:24px; }
        }

        .emp-ps-side, .emp-ps-card, .emp-ps-hero {
          opacity:0; transform:translateY(14px);
          transition:opacity .45s ease, transform .45s ease;
        }
        .emp-ps.is-on .emp-ps-side { opacity:1; transform:none; }
        .emp-ps.is-on .emp-ps-hero { opacity:1; transform:none; transition-delay:.06s; }
        .emp-ps.is-on .emp-ps-card { opacity:1; transform:none; transition-delay:.12s; }

        .emp-ps-hero {
          background:#0f172a;
          border-radius:14px;
          padding:18px 18px;
          display:flex; align-items:center; justify-content:space-between;
          gap:14px; flex-wrap:wrap;
          position:relative; overflow:hidden;
          margin-bottom:20px;
        }
        @media (min-width: 576px) {
          .emp-ps-hero { padding:24px 30px; border-radius:16px; margin-bottom:24px; }
        }
        .emp-ps-hero::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size:24px 24px; pointer-events:none;
        }
        .emp-ps-hero::after {
          content:''; position:absolute; width:280px; height:280px;
          background:rgba(56,189,248,0.1); border-radius:50%;
          top:-140px; right:-80px; pointer-events:none;
        }
        .emp-ps-hero-left { position:relative; z-index:1; flex:1 1 180px; min-width:0; }
        .emp-ps-hero-tag {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          color:#7dd3fc; font-size:10px; font-weight:700;
          letter-spacing:0.8px; text-transform:uppercase;
          padding:4px 12px; border-radius:100px; margin-bottom:10px;
        }
        .emp-ps-hero-tag .dot { width:5px; height:5px; background:#38bdf8; border-radius:50%; }
        .emp-ps-hero h1 {
          font-size:19px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:4px;
        }
        @media (min-width: 576px) { .emp-ps-hero h1 { font-size:22px; } }
        .emp-ps-hero p {
          font-size:12.5px; color:#94a3b8;
          line-height:1.6; word-break:break-word;
        }
        @media (min-width: 576px) { .emp-ps-hero p { font-size:13px; } }
        .emp-ps-count {
          position:relative; z-index:1; flex:0 0 auto;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          border-radius:12px; padding:10px 18px; text-align:center;
        }
        @media (min-width: 576px) { .emp-ps-count { padding:12px 22px; } }
        .emp-ps-count b {
          display:block; font-size:22px; font-weight:800; color:#fff; line-height:1.1;
        }
        @media (min-width: 576px) { .emp-ps-count b { font-size:26px; } }
        .emp-ps-count span {
          font-size:10px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:#7dd3fc;
        }

        .emp-ps-card {
          background:#fff; border:1.5px solid #e5e7eb; border-radius:14px;
          overflow:hidden;
        }
        @media (min-width: 576px) { .emp-ps-card { border-radius:16px; } }
        .emp-ps-card-head {
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; padding:16px;
          border-bottom:1px solid #f3f4f6; flex-wrap:wrap;
        }
        @media (min-width: 576px) { .emp-ps-card-head { padding:20px 24px; } }
        .emp-ps-card-title { display:flex; align-items:center; gap:12px; min-width:0; }
        .emp-ps-card-ico {
          width:38px; height:38px; flex-shrink:0;
          background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.22);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          color:#0284c7;
        }
        .emp-ps-card-head h2 { font-size:15px; font-weight:800; color:#111827; letter-spacing:-0.3px; }
        @media (min-width: 576px) { .emp-ps-card-head h2 { font-size:16px; } }
        .emp-ps-card-head p { font-size:12px; color:#9ca3af; margin-top:2px; }

        .emp-ps-table-wrap { display:none; max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; }
        .emp-ps-table { width:100%; border-collapse:collapse; min-width:560px; }
        .emp-ps-table thead th {
          background:#f8fafc; color:#0f172a;
          font-size:11px; font-weight:800; letter-spacing:0.6px;
          text-transform:uppercase; text-align:left;
          padding:13px 16px; border-bottom:2px solid #e2e8f0;
          white-space:nowrap;
        }
        .emp-ps-table tbody td {
          padding:14px 16px; font-size:13.5px; color:#374151;
          border-bottom:1px solid #f1f5f9; vertical-align:middle;
        }
        .emp-ps-table tbody tr:hover { background:#f8fafc; }
        .emp-ps-table tbody tr:last-child td { border-bottom:none; }

        .emp-ps-mcards { display:grid; gap:12px; padding:14px; }
        .emp-ps-mcard {
          border:1.5px solid #e5e7eb; border-radius:12px;
          padding:14px; background:#fff;
        }
        .emp-ps-mcard-top {
          display:flex; align-items:center; justify-content:space-between;
          gap:8px; margin-bottom:8px;
        }
        .emp-ps-mcard-sl {
          font-size:11px; font-weight:700; color:#94a3b8;
          letter-spacing:0.5px; text-transform:uppercase;
        }
        .emp-ps-mcard-period {
          font-size:15px; font-weight:800; color:#0f172a;
          margin-bottom:5px; letter-spacing:-0.2px;
        }
        .emp-ps-mcard-file {
          font-size:13px; color:#6b7280; line-height:1.5;
          word-break:break-all; margin-bottom:12px;
        }
        .emp-ps-mcard-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .emp-ps-mcard-btn { flex:1 1 120px; min-width:0; justify-content:center; height:42px; }

        @media (min-width: 768px) {
          .emp-ps-table-wrap { display:block; }
          .emp-ps-mcards { display:none; }
        }

        .emp-ps-file {
          display:inline-flex; align-items:center; gap:8px;
          font-weight:600; color:#0f172a; max-width:100%; min-width:0;
        }
        .emp-ps-file-name {
          overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
          max-width:220px;
        }
        .emp-ps-ext {
          font-size:10px; font-weight:800; letter-spacing:0.5px;
          padding:3px 8px; border-radius:6px; text-transform:uppercase;
          flex-shrink:0;
        }
        .emp-ps-ext.pdf { background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; }
        .emp-ps-ext.img { background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; }

        .emp-ps-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:6px;
          height:38px; padding:0 14px; border-radius:8px;
          font-size:12.5px; font-weight:700; cursor:pointer;
          font-family:'Plus Jakarta Sans', sans-serif;
          transition:transform .12s, box-shadow .15s, background .15s;
          border:1.5px solid transparent;
        }
        @media (min-width: 576px) { .emp-ps-btn { height:34px; } }
        .emp-ps-btn svg { flex-shrink:0; }
        .emp-ps-btn-view {
          background:rgba(56,189,248,0.1); border-color:rgba(56,189,248,0.35);
          color:#0369a1;
        }
        .emp-ps-btn-view:hover { background:rgba(56,189,248,0.18); }
        .emp-ps-btn-dl {
          background:#0f172a; color:#fff;
        }
        .emp-ps-btn-dl:hover { box-shadow:0 4px 14px rgba(15,23,42,0.2); transform:translateY(-1px); }
        .emp-ps-actions { display:flex; gap:8px; flex-wrap:wrap; }

        .emp-ps-loading, .emp-ps-empty, .emp-ps-denied {
          padding:44px 16px; text-align:center;
          font-size:13px; color:#9ca3af; font-weight:600;
          line-height:1.6;
        }
        @media (min-width: 576px) { .emp-ps-loading, .emp-ps-empty, .emp-ps-denied { padding:56px 24px; font-size:13.5px; } }
        .emp-ps-loading .emp-ps-spinner {
          width:26px; height:26px; margin:0 auto 14px;
          border:3px solid #e5e7eb; border-top-color:#0284c7;
          border-radius:50%; animation:empPsSpin .7s linear infinite;
        }
        @keyframes empPsSpin { to { transform:rotate(360deg); } }
        .emp-ps-empty svg, .emp-ps-denied svg { display:block; margin:0 auto 14px; color:#cbd5e1; }
        .emp-ps-empty b, .emp-ps-denied b { display:block; color:#334155; font-size:15px; margin-bottom:6px; }
        .emp-ps-denied svg { color:#f59e0b; }

        .emp-ps-pager {
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; padding:14px 16px; border-top:1px solid #f3f4f6;
          flex-wrap:wrap;
        }
        @media (min-width: 576px) { .emp-ps-pager { padding:16px 24px; } }
        .emp-ps-pager-info { font-size:12px; color:#9ca3af; font-weight:600; }
        @media (min-width: 576px) { .emp-ps-pager-info { font-size:12.5px; } }
        .emp-ps-pager-btns { display:flex; gap:8px; width:100%; }
        @media (min-width: 576px) { .emp-ps-pager-btns { width:auto; } }
        .emp-ps-page-btn {
          height:40px; flex:1; padding:0 16px; border-radius:8px;
          border:1.5px solid #e5e7eb; background:#fff;
          font-size:12.5px; font-weight:700; color:#4b5563;
          font-family:'Plus Jakarta Sans', sans-serif; cursor:pointer;
          transition:all .15s;
        }
        @media (min-width: 576px) { .emp-ps-page-btn { height:34px; flex:none; } }
        .emp-ps-page-btn:hover:not(:disabled) {
          border-color:#38bdf8; color:#0369a1; background:rgba(56,189,248,0.06);
        }
        .emp-ps-page-btn:disabled { opacity:.4; cursor:not-allowed; }
        @media (max-width: 575px) {
          .emp-ps-pager { flex-direction:column; align-items:stretch; text-align:center; }
        }

        .emp-ps-modal-back {
          position:fixed; inset:0; z-index:1050;
          background:rgba(15,23,42,0.6);
          display:flex; align-items:center; justify-content:center;
          padding:16px;
        }
        @media (min-width: 576px) { .emp-ps-modal-back { padding:24px; } }
        .emp-ps-modal {
          background:#fff; border-radius:14px; overflow:hidden;
          width:100%; max-width:900px;
          max-height:100vh; max-height:100dvh;
          display:flex; flex-direction:column;
          box-shadow:0 24px 64px rgba(0,0,0,0.3);
        }
        @media (min-width: 576px) { .emp-ps-modal { border-radius:16px; max-height:90vh; max-height:90dvh; } }
        @media (max-width: 575px) {
          .emp-ps-modal-back { padding:0; }
          .emp-ps-modal {
            max-width:100%;
            height:100vh; height:100dvh;
            border-radius:0;
          }
        }
        .emp-ps-modal-head {
          background:#0f172a; color:#fff;
          padding:14px 16px; display:flex; align-items:center;
          justify-content:space-between; gap:12px; flex-shrink:0;
        }
        @media (min-width: 576px) { .emp-ps-modal-head { padding:16px 22px; } }
        .emp-ps-modal-head h3 {
          font-size:13.5px; font-weight:700; min-width:0;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        @media (min-width: 576px) { .emp-ps-modal-head h3 { font-size:14.5px; } }
        .emp-ps-modal-close {
          background:none; border:none; color:#94a3b8;
          cursor:pointer; padding:6px; display:flex; border-radius:6px;
          transition:color .15s, background .15s; flex-shrink:0;
          min-width:36px; min-height:36px; align-items:center; justify-content:center;
        }
        .emp-ps-modal-close:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .emp-ps-modal-body {
          background:#f1f5f9; padding:0;
          overflow:auto; flex:1 1 auto; min-height:300px;
          display:flex; align-items:center; justify-content:center;
          overscroll-behavior:contain;
          -webkit-overflow-scrolling:touch;
        }
        @media (max-width: 575px) { .emp-ps-modal-body { min-height:0; } }
        .emp-ps-modal-body iframe {
          width:100%; height:65vh; height:65dvh;
          border:none; background:#fff; display:block;
        }
        @media (max-width: 575px) { .emp-ps-modal-body iframe { height:100%; } }
        .emp-ps-modal-body img {
          max-width:100%; max-height:65vh; max-height:65dvh;
          object-fit:contain; display:block; background:#fff;
        }
        @media (max-width: 575px) { .emp-ps-modal-body img { max-height:100%; } }
        .emp-ps-modal-msg { text-align:center; padding:36px 20px; }
        .emp-ps-modal-msg svg { color:#cbd5e1; margin-bottom:12px; }
        .emp-ps-modal-msg b { display:block; color:#334155; font-size:15px; margin-bottom:6px; word-break:break-all; }
        .emp-ps-modal-msg p { font-size:13px; color:#94a3b8; line-height:1.6; }
        .emp-ps-modal-foot {
          padding:12px 16px; border-top:1px solid #e5e7eb;
          display:flex; justify-content:flex-end; gap:10px;
          background:#fff; flex-shrink:0;
        }
        @media (min-width: 576px) { .emp-ps-modal-foot { padding:14px 22px; } }
        .emp-ps-modal-foot .emp-ps-btn { height:42px; flex:1; }
        @media (min-width: 576px) { .emp-ps-modal-foot .emp-ps-btn { height:38px; flex:none; padding:0 18px; } }
        .emp-ps-btn-ghost {
          background:#fff; border-color:#e5e7eb; color:#6b7280;
        }
        .emp-ps-btn-ghost:hover { background:#f9fafb; border-color:#d1d5db; }
      `}</style>

      <div className="emp-ps-crumbs">
        <div className="emp-ps-wrap">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/emp-dashboard">Dashboard</Link>
          <span className="sep">/</span>
          <strong>My Payslips</strong>
        </div>
      </div>

      <div className="emp-ps-wrap emp-ps-body">
        <div className="emp-ps-grid">
          <div className="emp-ps-side">
            <Sidebar />
          </div>

          <div className="emp-ps-main">
            <section className="emp-ps-hero">
              <div className="emp-ps-hero-left">
                <div className="emp-ps-hero-tag">
                  <span className="dot" />
                  Employee Portal
                </div>
                <h1>My Payslips</h1>
                <p>
                  {employee
                    ? `${employee.name} · ${employee.employee_code || "—"}${
                        employee.department_name
                          ? " · " + employee.department_name
                          : ""
                      }${
                        employee.designation_name
                          ? " · " + employee.designation_name
                          : ""
                      }`
                    : "View and download your salary payslips"}
                </p>
              </div>
              <div className="emp-ps-count">
                <b>{totalRecords}</b>
                <span>Payslips</span>
              </div>
            </section>

            <div className="emp-ps-card">
              <div className="emp-ps-card-head">
                <div className="emp-ps-card-title">
                  <div className="emp-ps-card-ico">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h2>Payslip History</h2>
                    <p>Your payslips, newest first</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="emp-ps-loading">
                  <div className="emp-ps-spinner" />
                  Loading payslips...
                </div>
              ) : accessError && !data.length ? (
                <div className="emp-ps-denied">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  <b>Access unavailable</b>
                  {accessError}
                </div>
              ) : !data.length ? (
                <div className="emp-ps-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <b>No payslips yet</b>
                  Payslips issued by HR will appear here.
                </div>
              ) : (
                <>
                  <div className="emp-ps-table-wrap">
                    <table className="emp-ps-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Pay Period</th>
                          <th>Payslip File</th>
                          {/* <th>Issued On</th> */}
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, idx) => {
                          const ext = getFileExt(row.payslip);
                          return (
                            <tr key={row.id}>
                              <td>{(page - 1) * perPage + idx + 1}</td>
                              <td style={{ fontWeight: 600 }}>
                                {formatDate(row.selected_date)}
                              </td>
                              <td>
                                <span className="emp-ps-file">
                                  <span
                                    className={`emp-ps-ext ${
                                      ext === "pdf" ? "pdf" : "img"
                                    }`}
                                  >
                                    {ext || "file"}
                                  </span>
                                  <span className="emp-ps-file-name">
                                    {getFileName(row.payslip)}
                                  </span>
                                </span>
                              </td>
                              {/* <td>
                                {row.created_at
                                  ? new Date(row.created_at).toLocaleDateString()
                                  : "-"}
                              </td> */}
                              <td>
                                <div className="emp-ps-actions">
                                  <Link
                                    href={`/payslip/view?id=${row.id}`}
                                    className="emp-ps-btn emp-ps-btn-view"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    View
                                  </Link>
                                  <button
                                    type="button"
                                    className="emp-ps-btn emp-ps-btn-dl"
                                    onClick={() => openDownload(row)}
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                      <polyline points="7 10 12 15 17 10" />
                                      <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="emp-ps-mcards">
                    {data.map((row, idx) => {
                      const ext = getFileExt(row.payslip);
                      return (
                        <div className="emp-ps-mcard" key={row.id}>
                          <div className="emp-ps-mcard-top">
                            <span className="emp-ps-mcard-sl">
                              SL {(page - 1) * perPage + idx + 1}
                            </span>
                            <span
                              className={`emp-ps-ext ${
                                ext === "pdf" ? "pdf" : "img"
                              }`}
                            >
                              {ext || "file"}
                            </span>
                          </div>
                          <div className="emp-ps-mcard-period">
                            {formatDate(row.selected_date)}
                          </div>
                          <div className="emp-ps-mcard-file">
                            {getFileName(row.payslip)}
                          </div>
                          <div className="emp-ps-mcard-actions">
                            <Link
                              href={`/payslip/view?id=${row.id}`}
                              className="emp-ps-btn emp-ps-btn-view emp-ps-mcard-btn"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              View
                            </Link>
                            <button
                              type="button"
                              className="emp-ps-btn emp-ps-btn-dl emp-ps-mcard-btn"
                              onClick={() => openDownload(row)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="emp-ps-pager">
                    <span className="emp-ps-pager-info">
                      Showing{" "}
                      {(page - 1) * perPage + 1}–
                      {Math.min(page * perPage, totalRecords)} of {totalRecords}{" "}
                      payslips
                    </span>
                    <div className="emp-ps-pager-btns">
                      <button
                        type="button"
                        className="emp-ps-page-btn"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        ← Previous
                      </button>
                      <button
                        type="button"
                        className="emp-ps-page-btn"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {viewRow && (
        <div className="emp-ps-modal-back" onClick={closeView}>
          <div
            className="emp-ps-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-ps-modal-head">
              <h3>
                {getFileName(viewRow.payslip)}
                {viewRow.selected_date
                  ? ` — ${formatDate(viewRow.selected_date)}`
                  : ""}
              </h3>
              <button
                type="button"
                className="emp-ps-modal-close"
                onClick={closeView}
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="emp-ps-modal-body">
              {previewLoading ? (
                <div className="emp-ps-modal-msg">
                  <div
                    className="emp-ps-spinner"
                    style={{
                      width: 26,
                      height: 26,
                      margin: "0 auto 14px",
                      border: "3px solid #e5e7eb",
                      borderTopColor: "#0284c7",
                      borderRadius: "50%",
                      animation: "empPsSpin .7s linear infinite",
                    }}
                  />
                  <b>Loading preview...</b>
                </div>
              ) : previewError === "unsupported" ? (
                <div className="emp-ps-modal-msg">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <b>{getFileName(viewRow.payslip)}</b>
                  <p>
                    Only PDF or image files can be previewed. Use Download to
                    open it.
                  </p>
                </div>
              ) : previewError === "failed" ? (
                <div className="emp-ps-modal-msg">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <b>Could not load preview</b>
                  <p>Please try downloading the file instead.</p>
                </div>
              ) : previewUrl && isImageFile(viewRow.payslip || previewUrl) ? (
                <img src={previewUrl} alt={getFileName(viewRow.payslip)} />
              ) : previewUrl ? (
                <iframe
                  src={previewUrl}
                  title={getFileName(viewRow.payslip)}
                  type="application/pdf"
                />
              ) : (
                <div className="emp-ps-modal-msg">
                  <b>Preparing preview...</b>
                </div>
              )}
            </div>

            <div className="emp-ps-modal-foot">
              <button
                type="button"
                className="emp-ps-btn emp-ps-btn-dl"
                onClick={() => openDownload(viewRow)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
              <button
                type="button"
                className="emp-ps-btn emp-ps-btn-ghost"
                onClick={closeView}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
