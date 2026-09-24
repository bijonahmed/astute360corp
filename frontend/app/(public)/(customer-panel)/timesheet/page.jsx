"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../emp-dashboard/sidebar";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const EMPTY_SUMMARY = {
  total_hours: 0,
  total_entries: 0,
  days_worked: 0,
  status_counts: { pending: 0, approved: 0, cancelled: 0 },
  project_totals: [],
  day_totals: [],
};

const STATUS_META = {
  0: { label: "Pending", cls: "pending" },
  1: { label: "Approved", cls: "approved" },
  2: { label: "Cancelled", cls: "cancelled" },
};

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "0", label: "Pending" },
  { value: "1", label: "Approved" },
  { value: "2", label: "Cancelled" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function EmpWorkSubmitPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [projects, setProjects] = useState([]);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [accessError, setAccessError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [showForm, setShowForm] = useState(false);
  const [tsMonth, setTsMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [tsEntries, setTsEntries] = useState([]);
  const [tsHours, setTsHours] = useState({});
  const [tsProjectId, setTsProjectId] = useState("");
  const [monthList, setMonthList] = useState([]);
  const [tsLoading, setTsLoading] = useState(false);
  const [tsSize, setTsSize] = useState("max");
  const [groupPreview, setGroupPreview] = useState(null);

  useEffect(() => {
    setMounted(true);
    document.title = "Time Sheet";
  }, []);

  const getApiBase = () =>
    (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  });

  const logoutToLogin = () => {
    ["token", "username", "roles", "permissions", "user"].forEach((k) =>
      localStorage.removeItem(k)
    );
    router.replace("/emp-login");
  };

  const formatDateShort = (d) => {
    if (!d) return "-";
    try {
      return new Date(`${String(d).slice(0, 10)}T00:00:00`).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
    } catch (e) {
      return d;
    }
  };

  const statusMeta = (s) => STATUS_META[Number(s)] || STATUS_META[0];

  const monthLabel = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [month]);

  const groupedEntries = useMemo(() => {
    const map = new Map();
    entries.forEach((row) => {
      const key = String(row.work_date || "").slice(0, 7);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    let sl = 0;
    return Array.from(map.entries()).map(([key, rows]) => {
      const [y, m] = key.split("-").map(Number);
      const label =
        y && m >= 1 && m <= 12 ? `${MONTH_NAMES[m - 1]} ${y}` : key;
      const rowsWithSl = rows.map((r) => ({ ...r, sl: ++sl }));
      return {
        key,
        label,
        rows: rowsWithSl,
        hours: rows.reduce((s, r) => s + Number(r.hours || 0), 0),
      };
    });
  }, [entries]);

  const monthStatusMeta = (rows) => {
    const codes = Array.from(new Set(rows.map((r) => Number(r.status))));
    if (codes.length === 1) return STATUS_META[codes[0]] || STATUS_META[0];
    return { label: "Mixed", cls: "mixed" };
  };

  const monthProjects = (rows) => {
    const names = Array.from(
      new Set(rows.map((r) => r.project_name || "").filter(Boolean))
    );
    if (!names.length) return "-";
    if (names.length <= 2) return names.join(", ");
    return `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
  };

  const formatDateTime = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return d;
    }
  };

  const handlePrint = () => window.print();

  const fetchProjects = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getApiBase()}/worksubmit/projects`, {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        logoutToLogin();
        return;
      }
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }
      setProjects(result.data || []);
      if (result.employee) setEmployee(result.employee);
    } catch (err) {
      console.error("Fetch projects failed:", err.message);
      toast.error(err.message || "Could not load projects");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchMonth = useCallback(
    async (selectedMonth = month, status = statusFilter) => {
      if (!token) return;
      setLoading(true);
      setAccessError("");
      try {
        const params = new URLSearchParams({
          month: selectedMonth,
          page: 1,
          pageSize: 500,
        });
        if (status !== "") params.set("status", status);
        const res = await fetch(
          `${getApiBase()}/worksubmit/index?${params.toString()}`,
          { headers: authHeaders() }
        );
        if (res.status === 401) {
          logoutToLogin();
          return;
        }
        const result = await res.json().catch(() => null);
        if (res.status === 403) {
          setAccessError(
            result?.message ||
              "No employee profile linked to this account. Please contact HR."
          );
          setEntries([]);
          setSummary(EMPTY_SUMMARY);
          setEmployee(null);
          return;
        }
        if (!res.ok) {
          throw new Error(result?.message || `HTTP Error: ${res.status}`);
        }
        setEmployee(result.employee || null);
        setEntries(result.data || []);
        setSummary({ ...EMPTY_SUMMARY, ...(result.summary || {}) });
      } catch (err) {
        console.error("Fetch work submissions failed:", err.message);
        setAccessError(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  useEffect(() => {
    if (!token) {
      router.replace("/emp-login");
      return;
    }
    fetchProjects();
  }, [token, fetchProjects, router]);

  useEffect(() => {
    if (!token) return;
    fetchMonth(month, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, month, statusFilter]);

  const openCreate = () => {
    const now = new Date();
    setTsMonth(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );
    if (projects.length && !tsProjectId) {
      setTsProjectId(String(projects[0].id));
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setTsHours({});
    setTsEntries([]);
  };

  const fetchTsMonth = useCallback(
    async (selectedMonth) => {
      if (!token) return;
      setTsLoading(true);
      try {
        const params = new URLSearchParams({
          month: selectedMonth,
          page: 1,
          pageSize: 500,
        });
        const res = await fetch(`${getApiBase()}/worksubmit/index?${params}`, {
          headers: authHeaders(),
        });
        if (res.status === 401) {
          logoutToLogin();
          return;
        }
        const result = await res.json().catch(() => null);
        if (res.status === 403) {
          setTsEntries([]);
          return;
        }
        if (!res.ok) {
          throw new Error(result?.message || `HTTP Error: ${res.status}`);
        }
        setTsEntries(result.data || []);
      } catch (err) {
        console.error("Fetch timesheet failed:", err.message);
        toast.error(err.message || "Could not load timesheet");
      } finally {
        setTsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  const fetchMonthList = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getApiBase()}/worksubmit/months`, {
        headers: authHeaders(),
      });
      const result = await res.json().catch(() => null);
      if (res.ok) setMonthList(result.data || []);
    } catch (err) {
      console.error("Fetch months failed:", err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!showForm) return;
    fetchTsMonth(tsMonth);
    fetchMonthList();
  }, [showForm, tsMonth, fetchTsMonth, fetchMonthList]);

  useEffect(() => {
    const hours = {};
    tsEntries.forEach((r) => {
      const d = String(r.work_date || "").slice(0, 10);
      hours[d] = String(r.hours);
    });
    setTsHours(hours);
  }, [tsEntries]);

  const handleTsHoursChange = (date, v) => {
    if (v === "") {
      setTsHours((p) => ({ ...p, [date]: "" }));
      return;
    }
    if (/^\d*\.?\d{0,2}$/.test(v)) {
      setTsHours((p) => ({ ...p, [date]: v }));
    }
  };

  const calendarDays = useMemo(() => {
    const [y, m] = tsMonth.split("-").map(Number);
    if (!y || !m) return [];
    const lastDay = new Date(y, m, 0).getDate();
    const days = [];
    for (let d = 1; d <= lastDay; d++) {
      const date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = new Date(y, m - 1, d).getDay();
      const weekend = dow === 0 || dow === 6;
      const dayEntries = tsEntries.filter(
        (e) => String(e.work_date || "").slice(0, 10) === date
      );
      const total = dayEntries.reduce((s, e) => s + Number(e.hours || 0), 0);
      const editableId =
        !weekend &&
        dayEntries.length === 1 &&
        Number(dayEntries[0].status) === 0
          ? dayEntries[0].id
          : null;
      const canCreate = !weekend && dayEntries.length === 0;
      const label = new Date(y, m - 1, d).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      days.push({ date, weekend, dayEntries, total, editableId, canCreate, label });
    }
    return days;
  }, [tsMonth, tsEntries]);

  const tsTotal = calendarDays.reduce((sum, day) => {
    if (day.weekend) return sum;
    if (day.editableId || day.canCreate) {
      const raw = tsHours[day.date];
      if (raw === "" || raw === undefined) {
        return sum + (day.editableId ? day.total : 0);
      }
      return sum + (Number(raw) || 0);
    }
    return sum + day.total;
  }, 0);

  const tsYear = tsMonth.slice(0, 4);
  const tsMonthNum = tsMonth.slice(5, 7);

  const yearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    const set = new Set([now, Number(tsYear)]);
    monthList.forEach((m) => set.add(Number(String(m.month).slice(0, 4))));
    return Array.from(set).sort((a, b) => b - a);
  }, [monthList, tsYear]);

  const changeTsMonth = (year, mon) => {
    setTsMonth(`${year}-${String(mon).padStart(2, "0")}`);
  };

  const handleBulkSave = async () => {
    if (!token) return;

    const updates = [];
    const creates = [];
    for (const day of calendarDays) {
      if (day.weekend) continue;
      const raw = tsHours[day.date];
      if (day.editableId) {
        if (raw === "" || raw === undefined) continue;
        if (!/^\d+(\.\d{1,2})?$/.test(String(raw))) {
          toast.error(`Invalid hours for ${day.label}`);
          return;
        }
        const n = Number(raw);
        if (n > 24) {
          toast.error("Hours cannot exceed 24 per day.");
          return;
        }
        if (n !== day.total) {
          updates.push({ id: day.editableId, hours: n });
        }
      } else if (day.canCreate) {
        if (raw === "" || raw === undefined) continue;
        if (!/^\d+(\.\d{1,2})?$/.test(String(raw))) {
          toast.error(`Invalid hours for ${day.label}`);
          return;
        }
        const n = Number(raw);
        if (n < 1) {
          toast.error("Hours must be at least 1.");
          return;
        }
        if (n > 24) {
          toast.error("Hours cannot exceed 24 per day.");
          return;
        }
        if (!tsProjectId) {
          toast.error("Select a project for new entries.");
          return;
        }
        creates.push({
          work_date: day.date,
          project_id: Number(tsProjectId),
          hours: n,
        });
      }
    }

    if (!updates.length && !creates.length) {
      toast.error("No changes to save.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${getApiBase()}/worksubmit/bulkUpdate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ updates, creates }),
      });
      if (res.status === 401) {
        logoutToLogin();
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.status === 422 && data?.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        return;
      }
      if (!res.ok) {
        throw new Error(data?.message || `HTTP Error: ${res.status}`);
      }
      toast.success(data?.message || "Timesheet saved");
      const savedMonth = tsMonth;
      closeForm();
      if (savedMonth !== month) {
        setMonth(savedMonth);
      }
      await fetchMonth(month, statusFilter);
      await fetchMonthList();
    } catch (err) {
      console.error("Save failed:", err.message);
      toast.error(err.message || "Network or server error!");
    } finally {
      setSaving(false);
    }
  };

  const openMonthEdit = (group) => {
    setTsMonth(group.key);
    if (projects.length && !tsProjectId) {
      setTsProjectId(String(projects[0].id));
    }
    setShowForm(true);
  };

  const handleDeleteMonth = async (group) => {
    if (!token) return;
    const pending = group.rows.filter((r) => Number(r.status) === 0);
    if (!pending.length) {
      toast.error("Only pending entries can be deleted.");
      return;
    }
    const ok = confirm(
      `Delete ${pending.length} pending entr${
        pending.length === 1 ? "y" : "ies"
      } of ${group.label}?`
    );
    if (!ok) return;
    let done = 0;
    for (const row of pending) {
      try {
        const res = await fetch(`${getApiBase()}/worksubmit/delete/${row.id}`, {
          method: "DELETE",
          headers: authHeaders(),
        });
        if (res.status === 401) {
          logoutToLogin();
          return;
        }
        if (res.ok) done += 1;
      } catch (err) {
        console.error(err);
      }
    }
    if (done) {
      toast.success(`${done} entr${done === 1 ? "y" : "ies"} deleted`);
      await fetchMonth(month, statusFilter);
    } else {
      toast.error("Delete failed");
    }
  };

  const totalHours = Number(summary.total_hours || 0);
  const statusCounts = summary.status_counts || {
    pending: 0,
    approved: 0,
    cancelled: 0,
  };
  const filteredCount = entries.length;

  return (
    <main className={`emp-ws ${mounted ? "is-on" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .emp-ws {
          font-family:'Plus Jakarta Sans', sans-serif;
          background:#f1f5f9;
          min-height:70vh;
          padding-bottom:48px;
          overflow-x:hidden;
          overflow-x:clip;
        }
        .emp-ws * { box-sizing:border-box; margin:0; padding:0; }
        .emp-ws img { max-width:100%; }

        .emp-ws-wrap { max-width:1200px; margin:0 auto; padding:0 16px; }
        @media (min-width: 576px) { .emp-ws-wrap { padding:0 24px; } }

        .emp-ws-crumbs {
          background:#fff; border-bottom:1px solid #e5e7eb;
          padding:12px 0; font-size:12.5px; color:#9ca3af;
        }
        @media (min-width: 576px) { .emp-ws-crumbs { padding:14px 0; font-size:13px; } }
        .emp-ws-crumbs .emp-ws-wrap { display:flex; flex-wrap:wrap; align-items:center; gap:2px 0; }
        .emp-ws-crumbs a { color:#6b7280; text-decoration:none; font-weight:600; transition:color .15s; }
        .emp-ws-crumbs a:hover { color:#0284c7; }
        .emp-ws-crumbs .sep { margin:0 8px; color:#d1d5db; }
        .emp-ws-crumbs strong { color:#111827; font-weight:700; }

        .emp-ws-body { padding-top:20px; }
        @media (min-width: 768px) { .emp-ws-body { padding-top:32px; } }

        .emp-ws-grid {
          display:grid;
          grid-template-columns:minmax(0, 1fr);
          gap:20px;
          align-items:start;
        }
        .emp-ws-grid > * { min-width:0; }
        .emp-ws-main { min-width:0; }
        @media (min-width: 992px) {
          .emp-ws-grid { grid-template-columns:280px minmax(0, 1fr); gap:24px; }
        }

        .emp-ws-side, .emp-ws-card, .emp-ws-hero {
          opacity:0; transform:translateY(14px);
          transition:opacity .45s ease, transform .45s ease;
        }
        .emp-ws.is-on .emp-ws-side { opacity:1; transform:none; }
        .emp-ws.is-on .emp-ws-hero { opacity:1; transform:none; transition-delay:.06s; }
        .emp-ws.is-on .emp-ws-card { opacity:1; transform:none; transition-delay:.12s; }

        .emp-ws-hero {
          background:#0f172a;
          border-radius:14px;
          padding:18px;
          display:flex; align-items:center; justify-content:space-between;
          gap:14px; flex-wrap:wrap;
          position:relative; overflow:hidden;
          margin-bottom:20px;
        }
        @media (min-width: 576px) {
          .emp-ws-hero { padding:24px 30px; border-radius:16px; margin-bottom:24px; }
        }
        .emp-ws-hero::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size:24px 24px; pointer-events:none;
        }
        .emp-ws-hero::after {
          content:''; position:absolute; width:280px; height:280px;
          background:rgba(56,189,248,0.1); border-radius:50%;
          top:-140px; right:-80px; pointer-events:none;
        }
        .emp-ws-hero-left { position:relative; z-index:1; flex:1 1 180px; min-width:0; }
        .emp-ws-hero-tag {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          color:#7dd3fc; font-size:10px; font-weight:700;
          letter-spacing:0.8px; text-transform:uppercase;
          padding:4px 12px; border-radius:100px; margin-bottom:10px;
        }
        .emp-ws-hero-tag .dot { width:5px; height:5px; background:#38bdf8; border-radius:50%; }
        .emp-ws-hero h1 {
          font-size:19px; font-weight:800; color:#fff;
          letter-spacing:-0.5px; margin-bottom:4px;
        }
        @media (min-width: 576px) { .emp-ws-hero h1 { font-size:22px; } }
        .emp-ws-hero p {
          font-size:12.5px; color:#94a3b8;
          line-height:1.6; word-break:break-word;
        }
        @media (min-width: 576px) { .emp-ws-hero p { font-size:13px; } }
        .emp-ws-count {
          position:relative; z-index:1; flex:0 0 auto;
          background:rgba(56,189,248,0.12); border:1px solid rgba(56,189,248,0.3);
          border-radius:12px; padding:10px 18px; text-align:center;
        }
        @media (min-width: 576px) { .emp-ws-count { padding:12px 22px; } }
        .emp-ws-count b {
          display:block; font-size:22px; font-weight:800; color:#fff; line-height:1.1;
        }
        @media (min-width: 576px) { .emp-ws-count b { font-size:26px; } }
        .emp-ws-count span {
          font-size:10px; font-weight:700; letter-spacing:1px;
          text-transform:uppercase; color:#7dd3fc;
        }

        .emp-ws-stats {
          display:grid; grid-template-columns:repeat(2, minmax(0,1fr));
          gap:10px; margin-bottom:20px;
        }
        @media (min-width: 768px) { .emp-ws-stats { grid-template-columns:repeat(4, minmax(0,1fr)); } }
        .emp-ws-stat {
          background:#fff; border:1.5px solid #e5e7eb; border-radius:12px;
          padding:14px 16px; position:relative; overflow:hidden;
        }
        .emp-ws-stat::before {
          content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
          background:#e2e8f0;
        }
        .emp-ws-stat.k-hours::before { background:#0284c7; }
        .emp-ws-stat.k-pending::before { background:#f59e0b; }
        .emp-ws-stat.k-approved::before { background:#10b981; }
        .emp-ws-stat.k-cancelled::before { background:#ef4444; }
        .emp-ws-stat b { display:block; font-size:20px; font-weight:800; color:#0f172a; line-height:1.2; }
        .emp-ws-stat span {
          font-size:10.5px; font-weight:700; letter-spacing:0.6px;
          text-transform:uppercase; color:#94a3b8;
        }

        .emp-ws-card {
          background:#fff; border:1.5px solid #e5e7eb; border-radius:14px;
          overflow:hidden; margin-bottom:20px;
        }
        @media (min-width: 576px) { .emp-ws-card { border-radius:16px; } }
        .emp-ws-card-head {
          display:flex; align-items:center; justify-content:space-between;
          gap:12px; padding:16px;
          border-bottom:1px solid #f3f4f6; flex-wrap:wrap;
        }
        @media (min-width: 576px) { .emp-ws-card-head { padding:18px 24px; } }
        .emp-ws-card-title { display:flex; align-items:center; gap:12px; min-width:0; }
        .emp-ws-card-ico {
          width:38px; height:38px; flex-shrink:0;
          background:rgba(56,189,248,0.1); border:1px solid rgba(56,189,248,0.22);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          color:#0284c7;
        }
        .emp-ws-card-head h2 { font-size:15px; font-weight:800; color:#111827; letter-spacing:-0.3px; }
        @media (min-width: 576px) { .emp-ws-card-head h2 { font-size:16px; } }
        .emp-ws-card-head p { font-size:12px; color:#9ca3af; margin-top:2px; }

        .emp-ws-head-actions {
          display:flex; align-items:center; gap:8px; flex-wrap:wrap;
          margin-left:auto;
        }

        .emp-ws-filter {
          height:38px; border:1.5px solid #e5e7eb; border-radius:8px;
          padding:0 10px; font-size:13px; font-weight:600; color:#0f172a;
          font-family:'Plus Jakarta Sans', sans-serif; background:#fff;
          outline:none; transition:border-color .15s; cursor:pointer;
          min-width:130px;
        }
        .emp-ws-filter:focus { border-color:#38bdf8; }

        .emp-ws-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:6px;
          height:40px; padding:0 16px; border-radius:8px;
          font-size:13px; font-weight:700; cursor:pointer;
          font-family:'Plus Jakarta Sans', sans-serif;
          transition:transform .12s, box-shadow .15s, background .15s;
          border:1.5px solid transparent; white-space:nowrap;
        }
        .emp-ws-btn svg { flex-shrink:0; }
        .emp-ws-btn-nav {
          background:#fff; border-color:#e5e7eb; color:#4b5563;
          height:38px; padding:0 12px; font-size:12.5px;
        }
        .emp-ws-btn-nav:hover:not(:disabled) {
          border-color:#38bdf8; color:#0369a1;
          background:rgba(56,189,248,0.06);
        }
        .emp-ws-btn-nav:disabled { opacity:.55; cursor:not-allowed; }
        .emp-ws-btn-create {
          background:#0284c7; color:#fff; border-color:#0284c7;
          box-shadow:0 3px 10px rgba(2,132,199,0.25);
        }
        .emp-ws-btn-create:hover { background:#0369a1; border-color:#0369a1; transform:translateY(-1px); }
        .emp-ws-btn-primary { background:#0f172a; color:#fff; }
        .emp-ws-btn-primary:hover { box-shadow:0 4px 14px rgba(15,23,42,0.2); transform:translateY(-1px); }
        .emp-ws-btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }
        .emp-ws-btn-accent {
          background:rgba(56,189,248,0.1); border-color:rgba(56,189,248,0.35);
          color:#0369a1; height:34px; padding:0 12px; font-size:12.5px;
        }
        .emp-ws-btn-accent:hover { background:rgba(56,189,248,0.18); }
        .emp-ws-btn-danger {
          background:#fef2f2; border-color:#fecaca; color:#b91c1c;
          height:34px; padding:0 12px; font-size:12.5px;
        }
        .emp-ws-btn-danger:hover { background:#fee2e2; }
        .emp-ws-btn-ghost {
          background:#fff; border-color:#e5e7eb; color:#6b7280;
          height:42px;
        }
        .emp-ws-btn-ghost:hover { background:#f9fafb; border-color:#d1d5db; }
        .emp-ws-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; box-shadow:none; }

        .emp-ws-hours-chip {
          font-size:13px; font-weight:800; color:#065f46;
          background:#ecfdf5; border:1px solid #bbf7d0;
          border-radius:8px; padding:5px 12px; white-space:nowrap;
          display:inline-block;
        }

        .emp-ws-badge {
          display:inline-flex; align-items:center; gap:6px;
          font-size:11.5px; font-weight:800; letter-spacing:0.3px;
          border-radius:100px; padding:5px 12px; white-space:nowrap;
          text-transform:uppercase;
        }
        .emp-ws-badge::before {
          content:''; width:6px; height:6px; border-radius:50%;
          background:currentColor; flex-shrink:0;
        }
        .emp-ws-badge.pending {
          background:#fffbeb; color:#b45309; border:1px solid #fde68a;
        }
        .emp-ws-badge.approved {
          background:#ecfdf5; color:#047857; border:1px solid #a7f3d0;
        }
        .emp-ws-badge.cancelled {
          background:#fef2f2; color:#b91c1c; border:1px solid #fecaca;
        }
        .emp-ws-badge.mixed {
          background:#f1f5f9; color:#475569; border:1px solid #cbd5e1;
        }

        .emp-ws-empty {
          padding:44px 16px; text-align:center;
          font-size:13px; color:#9ca3af; font-weight:600; line-height:1.6;
        }
        .emp-ws-empty svg { display:block; margin:0 auto 12px; color:#cbd5e1; }
        .emp-ws-empty b { display:block; color:#334155; font-size:14.5px; margin-bottom:5px; }
        .emp-ws-denied {
          padding:44px 16px; text-align:center;
          font-size:13px; color:#9ca3af; font-weight:600; line-height:1.6;
        }
        .emp-ws-denied svg { color:#f59e0b; display:block; margin:0 auto 12px; }
        .emp-ws-denied b { display:block; color:#334155; font-size:14.5px; margin-bottom:5px; }
        .emp-ws-loading {
          padding:44px 16px; text-align:center;
          font-size:13px; color:#9ca3af; font-weight:600;
        }
        .emp-ws-loading .emp-ws-spinner {
          width:26px; height:26px; margin:0 auto 14px;
          border:3px solid #e5e7eb; border-top-color:#0284c7;
          border-radius:50%; animation:empWsSpin .7s linear infinite;
        }
        @keyframes empWsSpin { to { transform:rotate(360deg); } }

        .emp-ws-table-wrap { display:none; max-width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; }
        .emp-ws-table { width:100%; border-collapse:collapse; min-width:640px; }
        .emp-ws-table thead th {
          background:#f8fafc; color:#0f172a;
          font-size:11px; font-weight:800; letter-spacing:0.6px;
          text-transform:uppercase; text-align:left;
          padding:13px 16px; border-bottom:2px solid #e2e8f0;
          white-space:nowrap;
        }
        .emp-ws-table th.num, .emp-ws-table td.num { text-align:right; }
        .emp-ws-table tbody td {
          padding:13px 16px; font-size:13.5px; color:#374151;
          border-bottom:1px solid #f1f5f9; vertical-align:middle;
        }
        .emp-ws-table tbody tr:hover { background:#f8fafc; }
        .emp-ws-table tbody tr:last-child td { border-bottom:none; }
        .emp-ws-table td b { color:#0f172a; }
        .emp-ws-row-actions { display:flex; gap:8px; flex-wrap:wrap; }

        .emp-ws-mcards { display:grid; gap:12px; padding:14px; }
        .emp-ws-mcard {
          border:1.5px solid #e5e7eb; border-radius:12px;
          padding:14px; background:#fff;
        }
        .emp-ws-mcard-top {
          display:flex; align-items:center; justify-content:space-between;
          gap:8px; margin-bottom:8px; flex-wrap:wrap;
        }
        .emp-ws-mcard-sl {
          font-size:11px; font-weight:700; color:#94a3b8;
          letter-spacing:0.5px; text-transform:uppercase;
        }
        .emp-ws-mcard-title { font-size:14.5px; font-weight:800; color:#0f172a; margin-bottom:2px; }
        .emp-ws-mcard-sub { font-size:12.5px; color:#6b7280; margin-bottom:10px; }
        .emp-ws-mcard-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .emp-ws-mcard-actions .emp-ws-btn { flex:1 1 110px; }

        @media (min-width: 768px) {
          .emp-ws-table-wrap { display:block; }
          .emp-ws-mcards { display:none; }
        }

        .emp-ws-totals-strip {
          display:flex; flex-wrap:wrap; gap:10px 22px;
          padding:16px 24px; border-top:1px solid #f3f4f6;
          background:#f8fafc;
        }
        .emp-ws-totals-strip div { font-size:12.5px; color:#64748b; font-weight:600; }
        .emp-ws-totals-strip div b { color:#0f172a; font-weight:800; }

        .emp-ws-modal-back {
          position:fixed; inset:0; z-index:1050;
          background:rgba(15,23,42,0.6);
          display:flex; align-items:center; justify-content:center;
          padding:16px;
        }
        @media (min-width: 576px) { .emp-ws-modal-back { padding:24px; } }
        .emp-ws-modal {
          background:#fff; border-radius:14px; overflow:hidden;
          width:100%; max-width:520px;
          max-height:100vh; max-height:100dvh;
          display:flex; flex-direction:column;
          box-shadow:0 24px 64px rgba(0,0,0,0.3);
        }
        @media (min-width: 576px) { .emp-ws-modal { border-radius:16px; max-height:90vh; max-height:90dvh; } }
        .emp-ws-modal-head {
          background:#0f172a; color:#fff;
          padding:14px 16px; display:flex; align-items:center;
          justify-content:space-between; gap:12px; flex-shrink:0;
        }
        @media (min-width: 576px) { .emp-ws-modal-head { padding:16px 22px; } }
        .emp-ws-modal-head h3 { font-size:14px; font-weight:700; min-width:0; }
        .emp-ws-modal-close {
          background:none; border:none; color:#94a3b8;
          cursor:pointer; padding:6px; display:flex; border-radius:6px;
          transition:color .15s, background .15s; flex-shrink:0;
          min-width:36px; min-height:36px; align-items:center; justify-content:center;
        }
        .emp-ws-modal-close:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .emp-ws-modal-body {
          padding:20px; overflow:auto; flex:1 1 auto; min-height:0;
          display:flex; flex-direction:column; gap:14px;
          overscroll-behavior:contain;
        }
        .emp-ws-field { min-width:0; }
        .emp-ws-field label {
          display:block; font-size:11px; font-weight:700;
          letter-spacing:0.5px; text-transform:uppercase;
          color:#64748b; margin-bottom:6px;
        }
        .emp-ws-field select, .emp-ws-field input {
          width:100%; height:44px; border:1.5px solid #e5e7eb;
          border-radius:8px; padding:0 12px; background:#fff;
          font-size:14px; font-weight:600; color:#0f172a;
          font-family:'Plus Jakarta Sans', sans-serif; outline:none;
          transition:border-color .15s;
        }
        .emp-ws-field select:focus, .emp-ws-field input:focus { border-color:#38bdf8; }
        .emp-ws-field .err {
          font-size:11.5px; color:#dc2626; font-weight:600; margin-top:5px;
        }
        .emp-ws-field .hint {
          font-size:11.5px; color:#94a3b8; font-weight:600; margin-top:5px;
        }
        .emp-ws-modal-foot {
          padding:14px 20px; border-top:1px solid #e5e7eb;
          display:flex; justify-content:flex-end; gap:10px;
          background:#fff; flex-shrink:0;
        }
        .emp-ws-modal-foot .emp-ws-btn { height:42px; flex:1; }
        @media (min-width: 576px) { .emp-ws-modal-foot .emp-ws-btn { flex:none; padding:0 20px; } }

        /* ===== calendar timesheet modal ===== */
        .emp-ws-modal.size-max {
          max-width:none; width:min(80vw, 1600px);
          height:80vh; height:80dvh; max-height:80vh; max-height:80dvh;
        }
        @media (max-width: 767px) {
          .emp-ws-modal.size-max { width:96vw; height:88vh; height:88dvh; max-height:88vh; }
        }
        .emp-ws-modal.size-normal { max-width:640px; }
        .emp-ws-modal.size-min { max-width:480px; height:auto; max-height:none; }
        .emp-ws-modal.size-min .emp-ws-modal-body,
        .emp-ws-modal.size-min .emp-ws-modal-foot { display:none; }
        .emp-ws-modal-winbtn {
          background:none; border:none; color:#94a3b8;
          cursor:pointer; padding:6px; display:flex; border-radius:6px;
          transition:color .15s, background .15s; flex-shrink:0;
          min-width:34px; min-height:34px; align-items:center; justify-content:center;
        }
        .emp-ws-modal-winbtn:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .emp-ws-modal-wins { display:flex; align-items:center; gap:2px; flex-shrink:0; }
        .ts-selects { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .ts-cal {
          border:1.5px solid #e5e7eb; border-radius:12px;
          display:flex; flex-direction:column;
          min-height:0; max-height:min(52vh, 560px); overflow-y:auto;
          overscroll-behavior:contain;
        }
        .ts-cal::-webkit-scrollbar { width:10px; }
        .ts-cal::-webkit-scrollbar-track { background:#f1f5f9; }
        .ts-cal::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:8px; border:2px solid #f1f5f9; }
        .ts-cal::-webkit-scrollbar-thumb:hover { background:#94a3b8; }
        .ts-cal-head {
          display:flex; justify-content:space-between; align-items:center;
          padding:11px 16px; background:#f8fafc;
          border-bottom:2px solid #e2e8f0;
          position:sticky; top:0; z-index:1;
          font-size:11px; font-weight:600; letter-spacing:0.5px;
          text-transform:uppercase; color:#0f172a;
        }
        .ts-cal-row {
          display:flex; justify-content:space-between; align-items:center;
          gap:14px; padding:11px 16px; border-bottom:1px solid #f1f5f9;
        }
        .ts-cal-row:last-child { border-bottom:none; }
        .ts-cal-row.weekend { background:#f8fafc; }
        .ts-day { font-size:14px; font-weight:500; color:#374151; min-width:0; }
        .ts-cal-row.weekend .ts-day { color:#94a3b8; }
        .ts-hours { flex-shrink:0; display:flex; align-items:center; }
        .ts-hours input {
          width:96px; height:38px; border:1.5px solid #e5e7eb; border-radius:8px;
          padding:0 12px; background:#fff; text-align:right;
          font-size:14px; font-weight:500; color:#0f172a;
          font-family:'Plus Jakarta Sans', sans-serif; outline:none;
          transition:border-color .15s;
        }
        .ts-hours input:focus { border-color:#38bdf8; }
        .ts-weekend-tag {
          font-size:11px; font-weight:600; letter-spacing:0.4px;
          text-transform:uppercase; color:#94a3b8;
          border:1.5px dashed #cbd5e1; border-radius:6px; padding:5px 10px;
        }
        .ts-locked {
          font-size:14px; font-weight:600; color:#475569;
          background:#f1f5f9; border-radius:6px; padding:7px 12px;
          min-width:64px; text-align:right; display:inline-block;
        }
        .ts-total {
          display:flex; justify-content:space-between; align-items:center;
          padding:13px 16px; background:#0f172a; border-radius:10px;
          font-size:13.5px; font-weight:600; color:#cbd5e1;
        }
        .ts-total b { font-size:17px; color:#fff; font-weight:700; }

        /* ===== entry preview (printable) ===== */
        .ts-preview-print {
          display:flex; flex-direction:column; gap:14px;
          -webkit-print-color-adjust:exact; print-color-adjust:exact;
        }
        .ts-preview-brand {
          display:flex; justify-content:space-between; align-items:baseline;
          gap:12px; border-bottom:2px solid #0f172a; padding-bottom:8px;
        }
        .ts-preview-brand b { font-size:16px; font-weight:700; color:#0f172a; }
        .ts-preview-brand span { font-size:12px; font-weight:500; color:#64748b; }
        .ts-preview-emp {
          display:grid; grid-template-columns:1fr 1fr; gap:10px 16px;
          background:#f8fafc; border:1px solid #e5e7eb;
          border-radius:8px; padding:13px 14px;
        }
        .ts-preview-emp div { display:flex; flex-direction:column; gap:3px; min-width:0; }
        .ts-preview-emp span {
          font-size:10.5px; font-weight:700; letter-spacing:0.5px;
          text-transform:uppercase; color:#94a3b8;
        }
        .ts-preview-emp b { font-size:13.5px; font-weight:600; color:#0f172a; }
        .ts-preview-table { width:100%; border-collapse:collapse; }
        .ts-preview-table th {
          border:1px solid #e5e7eb; padding:9px 12px;
          background:#0f172a; color:#fff; text-align:left;
          font-size:12px; font-weight:600; letter-spacing:0.3px;
        }
        .ts-preview-table td {
          border:1px solid #e5e7eb; padding:9px 12px;
          font-size:13.5px; font-weight:500; color:#0f172a;
        }
        .ts-preview-table tr.ts-preview-total td {
          background:#f1f5f9; font-weight:700; color:#0f172a;
        }
        .ts-preview-sign {
          display:flex; justify-content:space-between; gap:24px;
          margin-top:34px;
        }
        .ts-preview-sign div {
          flex:1; border-top:1.5px dashed #94a3b8; padding-top:8px;
          font-size:12px; font-weight:500; color:#64748b; text-align:center;
        }
        @media print {
          body * { visibility:hidden !important; }
          .ts-preview-print, .ts-preview-print * { visibility:visible !important; }
          .ts-preview-print {
            position:absolute; left:0; top:0; width:100%;
            padding:0; margin:0; gap:10px;
          }
          .ts-preview-print .emp-ws-badge {
            border:1px solid #94a3b8; color:#0f172a; background:#fff;
          }
        }
      `}</style>

      <Toaster position="top-right" />

      <div className="emp-ws-crumbs">
        <div className="emp-ws-wrap">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <Link href="/emp-dashboard">Dashboard</Link>
          <span className="sep">/</span>
          <strong>Work Submit</strong>
        </div>
      </div>

      <div className="emp-ws-wrap emp-ws-body">
        <div className="emp-ws-grid">
          <div className="emp-ws-side">
            <Sidebar />
          </div>

          <div className="emp-ws-main">
            <section className="emp-ws-hero">
              <div className="emp-ws-hero-left">
                <div className="emp-ws-hero-tag">
                  <span className="dot" />
                  Employee Portal
                </div>
                <h1>Time Sheet</h1>
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
                    : "Submit your daily project hours for approval"}
                </p>
              </div>
              <div className="emp-ws-count">
                <b>{totalHours}</b>
                <span>Hours · {monthLabel}</span>
              </div>
            </section>

            <div className="emp-ws-stats">
              <div className="emp-ws-stat k-hours">
                <b>{totalHours}</b>
                <span>Total Hours</span>
              </div>
              <div className="emp-ws-stat k-pending">
                <b>{statusCounts.pending || 0}</b>
                <span>Pending</span>
              </div>
              <div className="emp-ws-stat k-approved">
                <b>{statusCounts.approved || 0}</b>
                <span>Approved</span>
              </div>
              <div className="emp-ws-stat k-cancelled">
                <b>{statusCounts.cancelled || 0}</b>
                <span>Cancelled</span>
              </div>
            </div>

            {/* ===== LIST (first) + status filter + CREATE button (right) ===== */}
            <div className="emp-ws-card">
              <div className="emp-ws-card-head">
                <div className="emp-ws-card-title">
                  <div className="emp-ws-card-ico">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </div>
                  <div>
                    <h2>TimeSheet List</h2>
                    <p>
                      {groupedEntries.length} month
                      {groupedEntries.length === 1 ? "" : "s"} ·{" "}
                      {filteredCount} entries
                      {statusFilter !== "" && " · filtered"}
                    </p>
                  </div>
                </div>

                <div className="emp-ws-head-actions">
                  <select
                    className="emp-ws-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className="emp-ws-btn emp-ws-btn-nav"
                    onClick={() => {
                      fetchProjects();
                      fetchMonth(month, statusFilter);
                    }}
                    disabled={loading}
                    aria-label="Refresh list"
                    title="Refresh"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={
                        loading
                          ? { animation: "empWsSpin .7s linear infinite" }
                          : undefined
                      }
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                    Refresh
                  </button>

                  <button
                    type="button"
                    className="emp-ws-btn emp-ws-btn-create"
                    onClick={openCreate}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="emp-ws-loading">
                  <div className="emp-ws-spinner" />
                  Loading submissions...
                </div>
              ) : accessError ? (
                <div className="emp-ws-denied">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  </svg>
                  <b>Access unavailable</b>
                  {accessError}
                </div>
              ) : entries.length === 0 ? (
                <div className="emp-ws-empty">
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <b>
                    {statusFilter === ""
                      ? `No submissions yet for ${monthLabel}`
                      : "No entries match this status filter"}
                  </b>
                  {statusFilter === ""
                    ? "Click the Create button to add your worked hours."
                    : "Try another status or clear the filter."}
                  {statusFilter === "" && (
                    <div style={{ marginTop: 14 }}>
                      <button
                        type="button"
                        className="emp-ws-btn emp-ws-btn-create"
                        onClick={openCreate}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Create Entry
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="emp-ws-table-wrap">
                    <table className="emp-ws-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Date</th>
                          <th>Project</th>
                          <th className="num">Hours</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedEntries.map((group, gi) => {
                          const meta = monthStatusMeta(group.rows);
                          return (
                            <tr key={group.key}>
                              <td>{gi + 1}</td>
                              <td style={{ fontWeight: 600 }}>
                                {group.label}
                              </td>
                              <td>
                                <b>{monthProjects(group.rows)}</b>
                              </td>
                              <td className="num">
                                <span className="emp-ws-hours-chip">
                                  {group.hours}
                                </span>
                              </td>
                              <td>
                                <span className={`emp-ws-badge ${meta.cls}`}>
                                  {meta.label}
                                </span>
                              </td>
                              <td>
                                <div className="emp-ws-row-actions">
                                  <button
                                    type="button"
                                    className="emp-ws-btn emp-ws-btn-nav"
                                    onClick={() => setGroupPreview(group)}
                                    title={`Preview ${group.label}`}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                      <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    Preview
                                  </button>
                                  <button
                                    type="button"
                                    className="emp-ws-btn emp-ws-btn-accent"
                                    onClick={() => openMonthEdit(group)}
                                    title={`Edit ${group.label}`}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    className="emp-ws-btn emp-ws-btn-danger"
                                    onClick={() => handleDeleteMonth(group)}
                                    title={`Delete pending entries of ${group.label}`}
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="emp-ws-mcards">
                    {groupedEntries.map((group, gi) => {
                      const meta = monthStatusMeta(group.rows);
                      return (
                        <div className="emp-ws-mcard" key={group.key}>
                          <div className="emp-ws-mcard-top">
                            <span className="emp-ws-mcard-sl">SL {gi + 1}</span>
                            <span className={`emp-ws-badge ${meta.cls}`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className="emp-ws-mcard-title">
                            {group.label}
                          </div>
                          <div className="emp-ws-mcard-sub">
                            {monthProjects(group.rows)} ·{" "}
                            <span className="emp-ws-hours-chip">
                              {group.hours} hrs
                            </span>
                          </div>
                          <div className="emp-ws-mcard-actions">
                            <button
                              type="button"
                              className="emp-ws-btn emp-ws-btn-nav"
                              onClick={() => setGroupPreview(group)}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              className="emp-ws-btn emp-ws-btn-accent"
                              onClick={() => openMonthEdit(group)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="emp-ws-btn emp-ws-btn-danger"
                              onClick={() => handleDeleteMonth(group)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="emp-ws-totals-strip">
                    <div>
                      Total hours:{" "}
                      <b>
                        {groupedEntries.reduce((s, g) => s + g.hours, 0)} hrs
                      </b>
                    </div>
                    <div>
                      Showing: <b>{filteredCount}</b>
                      {statusFilter !== "" && ` of ${summary.total_entries || 0}`}
                      {" · "}Months: <b>{groupedEntries.length}</b>
                    </div>
                    <div>
                      Days worked: <b>{summary.days_worked || 0}</b>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Month calendar timesheet modal ===== */}
      {showForm && (
        <div className="emp-ws-modal-back" onClick={closeForm}>
          <div
            className={`emp-ws-modal size-${tsSize}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-ws-modal-head">
              <h3 style={{ color: "#ffffff" }}>
                {`Time Sheet — ${MONTH_NAMES[Number(tsMonthNum) - 1]} ${tsYear}`}
              </h3>
              <div className="emp-ws-modal-wins">
                {tsSize === "min" ? (
                  <button
                    type="button"
                    className="emp-ws-modal-winbtn"
                    onClick={() => setTsSize("max")}
                    aria-label="Maximize"
                    title="Maximize"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                    </svg>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="emp-ws-modal-winbtn"
                      onClick={() => setTsSize("min")}
                      aria-label="Minimize"
                      title="Minimize"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="emp-ws-modal-winbtn"
                      onClick={() => setTsSize(tsSize === "max" ? "normal" : "max")}
                      aria-label={tsSize === "max" ? "Restore" : "Maximize"}
                      title={tsSize === "max" ? "Restore" : "Maximize"}
                    >
                      {tsSize === "max" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 4H4v5" />
                          <path d="M15 20h5v-5" />
                          <path d="M4 4l6 6" />
                          <path d="M20 20l-6-6" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="4" y="4" width="16" height="16" rx="2" />
                        </svg>
                      )}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="emp-ws-modal-close"
                  onClick={closeForm}
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="emp-ws-modal-body">
              <div className="ts-selects">
                <div className="emp-ws-field">
                  <label htmlFor="ts-month">Month</label>
                  <select
                    id="ts-month"
                    value={tsMonthNum}
                    onChange={(e) => changeTsMonth(tsYear, e.target.value)}
                    disabled={saving || tsLoading}
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={name} value={String(i + 1).padStart(2, "0")}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="emp-ws-field">
                  <label htmlFor="ts-year">Year</label>
                  <select
                    id="ts-year"
                    value={tsYear}
                    onChange={(e) => changeTsMonth(e.target.value, tsMonthNum)}
                    disabled={saving || tsLoading}
                  >
                    {yearOptions.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ts-cal">
                <div className="ts-cal-head">
                  <span>Day &amp; Date</span>
                  <span>Working Hours</span>
                </div>
                {tsLoading ? (
                  <div className="emp-ws-loading">
                    <div className="emp-ws-spinner" />
                    Loading...
                  </div>
                ) : (
                  calendarDays.map((day) => (
                    <div
                      key={day.date}
                      className={`ts-cal-row ${day.weekend ? "weekend" : ""}`}
                    >
                      <div className="ts-day">{day.label}</div>
                      <div className="ts-hours">
                        {day.weekend ? (
                          <span className="ts-weekend-tag">Weekend</span>
                        ) : day.editableId || day.canCreate ? (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={
                              tsHours[day.date] !== undefined
                                ? tsHours[day.date]
                                : ""
                            }
                            onChange={(e) =>
                              handleTsHoursChange(day.date, e.target.value)
                            }
                            disabled={saving}
                            placeholder="0"
                            aria-label={`Hours for ${day.label}`}
                          />
                        ) : (
                          <span className="ts-locked">
                            {Number(day.total).toFixed(2).replace(/\.00$/, "")}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="ts-total">
                <span>Total working Hours</span>
                <b>{tsTotal.toFixed(2).replace(/\.00$/, "")}</b>
              </div>

              <div className="emp-ws-field">
                <label htmlFor="ts-project">
                  Project <span className="hint">(for new entries)</span>
                </label>
                <select
                  id="ts-project"
                  value={tsProjectId}
                  onChange={(e) => setTsProjectId(e.target.value)}
                  disabled={saving}
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="emp-ws-modal-foot">
              <button
                type="button"
                className="emp-ws-btn emp-ws-btn-ghost"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="emp-ws-btn emp-ws-btn-primary"
                onClick={handleBulkSave}
                disabled={saving || tsLoading}
              >
                {saving ? "Saving..." : "Save Entries"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Month group preview modal (printable) ===== */}
      {groupPreview && (
        <div
          className="emp-ws-modal-back"
          onClick={() => setGroupPreview(null)}
        >
          <div
            className="emp-ws-modal size-normal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-ws-modal-head">
              <h3 style={{ color: "#ffffff" }}>
                {`${groupPreview.label} — TimeSheet`}
              </h3>
              <div className="emp-ws-modal-wins">
                <button
                  type="button"
                  className="emp-ws-modal-winbtn"
                  onClick={handlePrint}
                  aria-label="Print"
                  title="Print"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="emp-ws-modal-close"
                  onClick={() => setGroupPreview(null)}
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="emp-ws-modal-body">
              <div className="ts-preview-print">
                <div className="ts-preview-brand">
                  <b>Monthly TimeSheet</b>
                  <span>
                    {groupPreview.label} · Printed{" "}
                    {formatDateTime(new Date().toISOString())}
                  </span>
                </div>

                <div className="ts-preview-emp">
                  <div>
                    <span>Employee</span>
                    <b>{employee?.name || "-"}</b>
                  </div>
                  <div>
                    <span>Employee Code</span>
                    <b>{employee?.employee_code || "-"}</b>
                  </div>
                  <div>
                    <span>Department</span>
                    <b>{employee?.department_name || "-"}</b>
                  </div>
                  <div>
                    <span>Designation</span>
                    <b>{employee?.designation_name || "-"}</b>
                  </div>
                </div>

                <table className="ts-preview-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupPreview.rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.sl}</td>
                        <td>{formatDateShort(row.work_date)}</td>
                        <td>{row.project_name || "-"}</td>
                        <td>{Number(row.hours)}</td>
                        <td>{row.status_label || statusMeta(row.status).label}</td>
                      </tr>
                    ))}
                    <tr className="ts-preview-total">
                      <td colSpan={4}>
                        Total ({groupPreview.rows.length} entries)
                      </td>
                      <td>{groupPreview.hours} hrs</td>
                    </tr>
                  </tbody>
                </table>

                <div className="ts-preview-sign">
                  <div>Employee Signature</div>
                  <div>Approved By</div>
                </div>
              </div>
            </div>

            <div className="emp-ws-modal-foot">
              <button
                type="button"
                className="emp-ws-btn emp-ws-btn-ghost"
                onClick={() => setGroupPreview(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="emp-ws-btn emp-ws-btn-primary"
                onClick={handlePrint}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
