"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { username } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNormalized = (p = "") => {
    const noQuery = p.split("?")[0].split("#")[0];
    if (noQuery === "/") return "/";
    return noQuery.replace(/\/+$/, "");
  };

  const current = useMemo(() => getNormalized(pathname || "/"), [pathname]);

  const isActive = (href, { allowSubroutes = true } = {}) => {
    const normHref = getNormalized(href);
    if (normHref === "/") return current === "/";
    if (allowSubroutes) {
      return current === normHref || current.startsWith(normHref + "/");
    }
    return current === normHref;
  };

  const initials =
    mounted && username
      ? username
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "";

  const openLogout = (e) => {
    e.preventDefault();
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    try {
      ["token", "username", "roles", "permissions", "user"].forEach((k) =>
        localStorage.removeItem(k)
      );
    } finally {
      router.push("/emp-login");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const cancelLogout = () => setShowLogoutModal(false);

  return (
    <aside className="emp-side">
      <style>{`
        .emp-side * { box-sizing:border-box; margin:0; padding:0; }
        .emp-side {
          font-family:'Plus Jakarta Sans', sans-serif;
          background:#fff; border:1.5px solid #e5e7eb; border-radius:16px;
          overflow:hidden;
          max-width:100%;
        }
        .emp-side-head {
          background:#0f172a;
          padding:26px 22px;
          text-align:center;
          position:relative; overflow:hidden;
        }
        .emp-side-head::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size:22px 22px; pointer-events:none;
        }
        .emp-side-avatar {
          width:62px; height:62px; margin:0 auto 12px;
          background:linear-gradient(135deg, #38bdf8, #0284c7);
          border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:20px; font-weight:800; color:#0f172a;
          position:relative; z-index:1;
          border:3px solid rgba(255,255,255,0.12);
          flex-shrink:0;
        }
        .emp-side-avatar .emp-side-user-ico { display:flex; color:#0f172a; }
        .emp-side-user { position:relative; z-index:1; min-width:0; }
        .emp-side-hello {
          position:relative; z-index:1;
          font-size:11px; font-weight:600; letter-spacing:1.2px;
          text-transform:uppercase; color:#64748b; margin-bottom:4px;
        }
        .emp-side-name {
          position:relative; z-index:1;
          font-size:15px; font-weight:800; color:#fff;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          min-height:20px;
        }
        .emp-side-role {
          position:relative; z-index:1;
          display:inline-block; margin-top:8px;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          color:#7dd3fc; font-size:10px; font-weight:700;
          letter-spacing:0.8px; text-transform:uppercase;
          padding:4px 12px; border-radius:100px;
        }
        .emp-side-nav { padding:12px; display:flex; flex-direction:column; gap:4px; }
        .emp-side-link {
          display:flex; align-items:center; gap:11px;
          padding:11px 14px; border-radius:10px;
          font-size:13.5px; font-weight:600; color:#4b5563;
          text-decoration:none; border:none; background:none;
          font-family:'Plus Jakarta Sans', sans-serif;
          cursor:pointer; width:100%; text-align:left;
          transition:background .15s, color .15s;
        }
        .emp-side-link svg { flex-shrink:0; color:#9ca3af; transition:color .15s; }
        .emp-side-link:hover { background:#f1f5f9; color:#0f172a; }
        .emp-side-link:hover svg { color:#0284c7; }
        .emp-side-link.active {
          background:rgba(56,189,248,0.1);
          color:#0369a1; font-weight:700;
        }
        .emp-side-link.active svg { color:#0284c7; }
        .emp-side-divider { height:1px; background:#f3f4f6; margin:6px 8px; flex-shrink:0; }
        .emp-side-link.emp-side-logout { color:#dc2626; }
        .emp-side-link.emp-side-logout svg { color:#f87171; }
        .emp-side-link.emp-side-logout:hover { background:#fef2f2; color:#b91c1c; }
        .emp-side-link.emp-side-logout:hover svg { color:#dc2626; }

        .emp-logout-back {
          position:fixed; inset:0; z-index:1080;
          background:rgba(15,23,42,0.55);
          display:flex; align-items:center; justify-content:center;
          padding:16px;
          animation:empLogoutFade .2s ease;
          backdrop-filter:blur(3px);
        }
        .emp-logout-modal {
          background:#fff; border-radius:16px; overflow:hidden;
          width:100%; max-width:400px;
          box-shadow:0 24px 64px rgba(0,0,0,0.3);
          animation:empLogoutPop .28s cubic-bezier(.34,1.56,.64,1);
        }
        .emp-logout-head {
          background:#0f172a; color:#fff;
          padding:18px 20px; display:flex; align-items:center; gap:12px;
        }
        .emp-logout-ico {
          width:42px; height:42px; flex-shrink:0;
          background:rgba(248,113,113,0.15); border:1px solid rgba(248,113,113,0.35);
          border-radius:50%; display:flex; align-items:center; justify-content:center;
          color:#f87171;
        }
        .emp-logout-head h3 {
          font-size:15px; font-weight:800; color:#ffffff; letter-spacing:-0.2px;
        }
        .emp-logout-body {
          padding:22px 20px; text-align:center;
        }
        .emp-logout-body p {
          font-size:14px; color:#4b5563; font-weight:600; line-height:1.6;
        }
        .emp-logout-body p b { color:#0f172a; }
        .emp-logout-foot {
          padding:0 20px 20px; display:flex; gap:10px;
        }
        .emp-logout-btn {
          flex:1; height:44px; border-radius:10px;
          font-size:13.5px; font-weight:700; cursor:pointer;
          font-family:'Plus Jakarta Sans', sans-serif;
          border:1.5px solid transparent;
          display:inline-flex; align-items:center; justify-content:center; gap:7px;
          transition:transform .12s, box-shadow .15s, background .15s;
        }
        .emp-logout-btn:hover { transform:translateY(-1px); }
        .emp-logout-btn:active { transform:translateY(0); }
        .emp-logout-btn-no {
          background:#fff; border-color:#e5e7eb; color:#4b5563;
        }
        .emp-logout-btn-no:hover { background:#f9fafb; border-color:#d1d5db; }
        .emp-logout-btn-yes {
          background:#dc2626; color:#fff; border-color:#dc2626;
          box-shadow:0 3px 10px rgba(220,38,38,0.3);
        }
        .emp-logout-btn-yes:hover { background:#b91c1c; border-color:#b91c1c; }
        @keyframes empLogoutFade {
          from { opacity:0; }
          to { opacity:1; }
        }
        @keyframes empLogoutPop {
          0% { opacity:0; transform:scale(.88) translateY(14px); }
          100% { opacity:1; transform:scale(1) translateY(0); }
        }

        @media (max-width: 991px) {
          .emp-side-head {
            display:flex; flex-direction:row; align-items:center;
            text-align:left; padding:14px 16px; gap:12px;
          }
          .emp-side-avatar { width:46px; height:46px; margin:0; font-size:15px; border-width:2px; }
          .emp-side-avatar .emp-side-user-ico svg { width:18px; height:18px; }
          .emp-side-hello { font-size:9.5px; letter-spacing:1px; margin-bottom:2px; }
          .emp-side-name { font-size:14px; min-height:0; }
          .emp-side-role { margin-top:4px; padding:3px 10px; font-size:9px; }

          .emp-side-nav {
            flex-direction:row; gap:8px; padding:10px 12px;
            overflow-x:auto; overflow-y:hidden;
            -webkit-overflow-scrolling:touch;
            scrollbar-width:none;
          }
          .emp-side-nav::-webkit-scrollbar { display:none; }
          .emp-side-link {
            width:auto; flex:0 0 auto; white-space:nowrap;
            padding:9px 14px; font-size:13px; min-height:40px;
          }
          .emp-side-divider {
            width:1px; height:22px; margin:0 2px; align-self:center;
            background:#e5e7eb;
          }
        }
        @media (max-width: 480px) {
          .emp-side-head { padding:12px 14px; gap:10px; }
          .emp-side-avatar { width:40px; height:40px; font-size:13px; }
          .emp-side-name { font-size:13.5px; }
          .emp-side-nav { padding:9px 10px; gap:6px; }
          .emp-side-link { padding:8px 12px; font-size:12.5px; min-height:38px; gap:8px; }
          .emp-side-link svg { width:14px; height:14px; }
        }
      `}</style>

      <div className="emp-side-head">
        <div className="emp-side-avatar">
          {initials || (
            <span className="emp-side-user-ico">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          )}
        </div>
        <div className="emp-side-user">
          <p className="emp-side-hello">Welcome back</p>
          <p className="emp-side-name">{mounted && username ? username : ""}</p>
          <span className="emp-side-role">Employee</span>
        </div>
      </div>

      <nav className="emp-side-nav">
        <Link
          href="/emp-dashboard"
          className={`emp-side-link ${isActive("/emp-dashboard") ? "active" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Account Information
        </Link>

        <Link
          href="/payslip"
          className={`emp-side-link ${isActive("/payslip") ? "active" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
         PaySlip
        </Link>

        <Link
          href="/timesheet"
          className={`emp-side-link ${isActive("/timesheet") ? "active" : ""}`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          TimeSheet
        </Link>

        <div className="emp-side-divider" />

        <button type="button" className="emp-side-link emp-side-logout" onClick={openLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </nav>

      {showLogoutModal && (
        <div className="emp-logout-back" onClick={cancelLogout}>
          <div
            className="emp-logout-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="emp-logout-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-logout-head">
              <div className="emp-logout-ico">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              <h3 id="emp-logout-title">Confirm Logout</h3>
            </div>
            <div className="emp-logout-body">
              <p>
                Are you sure you want to <b>logout</b> from your employee
                account?
              </p>
            </div>
            <div className="emp-logout-foot">
              <button
                type="button"
                className="emp-logout-btn emp-logout-btn-no"
                onClick={cancelLogout}
              >
                No, Stay
              </button>
              <button
                type="button"
                className="emp-logout-btn emp-logout-btn-yes"
                onClick={confirmLogout}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
