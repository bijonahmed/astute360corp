"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../../components/styles/customDataTable";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_META = {
  0: { label: "Pending", cls: "pending" },
  1: { label: "Approved", cls: "approved" },
  2: { label: "Cancelled", cls: "cancelled" },
};

const STATUS_OPTIONS = [
  { value: "0", label: "Pending" },
  { value: "1", label: "Approved" },
  { value: "2", label: "Cancelled" },
  { value: "", label: "All Status" },
];

export default function AdminWorkSubmitPage() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("0");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    approved: 0,
    cancelled: 0,
    total: 0,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    employee_id: "",
    project_id: "",
    work_date: "",
    hours: "",
    status: "0",
  });
  const [errors, setErrors] = useState({});
  const [groupPreview, setGroupPreview] = useState(null);

  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [calEmployee, setCalEmployee] = useState("");
  const [calEntries, setCalEntries] = useState([]);
  const [calHours, setCalHours] = useState({});
  const [calProjectId, setCalProjectId] = useState("");
  const [calStatus, setCalStatus] = useState("0");
  const [calLoading, setCalLoading] = useState(false);
  const [calSize, setCalSize] = useState("max");

  const authHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    document.title = "Timesheet List";
  }, []);

  const getApiBase = () =>
    (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

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

  const statusMeta = (s) => STATUS_META[Number(s)] || STATUS_META[0];

  const groupStatus = (rows) => {
    const codes = Array.from(new Set(rows.map((r) => Number(r.status))));
    if (codes.length === 1) return STATUS_META[codes[0]] || STATUS_META[0];
    return { label: "Mixed", cls: "mixed" };
  };

  const fetchDropdowns = useCallback(async () => {
    if (!token) return;
    try {
      const [empRes, projRes] = await Promise.all([
        fetch(`${getApiBase()}/worksubmit/admin/employees`, {
          headers: authHeaders,
        }),
        fetch(`${getApiBase()}/worksubmit/admin/projects`, {
          headers: authHeaders,
        }),
      ]);
      const emp = await empRes.json().catch(() => null);
      const proj = await projRes.json().catch(() => null);
      setEmployees(emp?.data || []);
      setProjects(proj?.data || []);
    } catch (err) {
      console.error("Fetch dropdowns failed:", err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        pageSize: "1000",
        searchQuery: search,
        status: statusFilter,
        employeeId: employeeFilter,
        projectId: projectFilter,
      });
      const res = await fetch(`${getApiBase()}/worksubmit/admin/index?${params}`, {
        headers: authHeaders,
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }
      setData(result.data || []);
      if (result.status_counts) setStatusCounts(result.status_counts);
    } catch (err) {
      console.error("Fetch work submissions failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search, statusFilter, employeeFilter, projectFilter]);

  useEffect(() => {
    fetchDropdowns();
  }, [fetchDropdowns]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const grouped = useMemo(() => {
    const map = new Map();
    data.forEach((row) => {
      const ym = String(row.work_date || "").slice(0, 7);
      const key = `${ym}|${row.employee_id}`;
      if (!map.has(key)) {
        const [y, m] = ym.split("-").map(Number);
        const label =
          y && m >= 1 && m <= 12 ? `${MONTH_NAMES[m - 1]} ${y}` : ym;
        map.set(key, {
          key,
          ym,
          label,
          employee_id: row.employee_id,
          employee_code: row.employee_code || "-",
          employee_name: row.employee_name || "-",
          department_name: row.department_name || "-",
          designation_name: row.designation_name || "-",
          rows: [],
          hours: 0,
        });
      }
      const g = map.get(key);
      g.rows.push(row);
      g.hours += Number(row.hours || 0);
    });
    const groups = Array.from(map.values()).sort(
      (a, b) =>
        a.ym.localeCompare(b.ym) ||
        a.employee_name.localeCompare(b.employee_name)
    );
    groups.forEach((g, i) => {
      g.sl = i + 1;
      g.rows.sort(
        (a, b) => String(a.work_date).localeCompare(String(b.work_date))
      );
      const names = Array.from(
        new Set(g.rows.map((r) => r.project_name || "").filter(Boolean))
      );
      g.projectLabel = !names.length
        ? "-"
        : names.length <= 2
          ? names.join(", ")
          : `${names.slice(0, 2).join(", ")} +${names.length - 2} more`;
      g.status = groupStatus(g.rows);
    });
    return groups;
  }, [data]);

  useEffect(() => {
    if (!groupPreview) return;
    const fresh = grouped.find((g) => g.key === groupPreview.key);
    setGroupPreview(fresh || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const openCal = (prefill = null) => {
    if (prefill?.employee_id) setCalEmployee(String(prefill.employee_id));
    setCalStatus(prefill ? "" : "0");
    if (prefill?.ym) {
      setCalMonth(prefill.ym);
    } else {
      const now = new Date();
      setCalMonth(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
      );
    }
    if (projects.length && !calProjectId) {
      setCalProjectId(String(projects[0].id));
    }
    setCalSize("max");
    setCalOpen(true);
  };

  const closeCal = () => {
    setCalOpen(false);
    setCalEntries([]);
    setCalHours({});
  };

  const fetchCalEntries = useCallback(async () => {
    if (!token || !calEmployee) {
      setCalEntries([]);
      return;
    }
    setCalLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        pageSize: "500",
        searchQuery: "",
        status: "",
        employeeId: calEmployee,
        month: calMonth,
        projectId: "",
      });
      const res = await fetch(`${getApiBase()}/worksubmit/admin/index?${params}`, {
        headers: authHeaders,
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(result?.message || `HTTP Error: ${res.status}`);
      }
      setCalEntries(result.data || []);
    } catch (err) {
      console.error("Fetch calendar entries failed:", err.message);
      toast.error(err.message || "Could not load timesheet");
    } finally {
      setCalLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, calEmployee, calMonth]);

  useEffect(() => {
    if (!calOpen) return;
    fetchCalEntries();
  }, [calOpen, fetchCalEntries]);

  useEffect(() => {
    const hours = {};
    calEntries.forEach((r) => {
      const d = String(r.work_date || "").slice(0, 10);
      hours[d] = String(r.hours);
    });
    setCalHours(hours);
  }, [calEntries]);

  const handleCalHoursChange = (date, v) => {
    if (v === "") {
      setCalHours((p) => ({ ...p, [date]: "" }));
      return;
    }
    if (/^\d*\.?\d{0,2}$/.test(v)) {
      setCalHours((p) => ({ ...p, [date]: v }));
    }
  };

  const calendarDays = useMemo(() => {
    const [y, m] = calMonth.split("-").map(Number);
    if (!y || !m) return [];
    const lastDay = new Date(y, m, 0).getDate();
    const days = [];
    for (let d = 1; d <= lastDay; d++) {
      const date = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = new Date(y, m - 1, d).getDay();
      const weekend = dow === 0 || dow === 6;
      const dayEntries = calEntries.filter(
        (e) => String(e.work_date || "").slice(0, 10) === date
      );
      const total = dayEntries.reduce((s, e) => s + Number(e.hours || 0), 0);
      const editableId =
        !weekend && dayEntries.length === 1 ? dayEntries[0].id : null;
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
  }, [calMonth, calEntries]);

  const calTotal = calendarDays.reduce((sum, day) => {
    if (day.weekend) return sum;
    if (day.editableId || day.canCreate) {
      const raw = calHours[day.date];
      if (raw === "" || raw === undefined) {
        return sum + (day.editableId ? day.total : 0);
      }
      return sum + (Number(raw) || 0);
    }
    return sum + day.total;
  }, 0);

  const calYear = calMonth.slice(0, 4);
  const calMonthNum = calMonth.slice(5, 7);

  const calYearOptions = useMemo(() => {
    const now = new Date().getFullYear();
    const set = new Set([now, Number(calYear), now - 1, now + 1]);
    return Array.from(set).sort((a, b) => b - a);
  }, [calYear]);

  const changeCalMonth = (year, mon) => {
    setCalMonth(`${year}-${String(mon).padStart(2, "0")}`);
  };

  const handleCalSave = async () => {
    if (!token) return;
    if (!calEmployee) {
      toast.error("Please select an employee.");
      return;
    }

    const statusNum = calStatus === "" ? null : Number(calStatus);
    const updates = [];
    const creates = [];
    for (const day of calendarDays) {
      if (day.editableId) {
        const raw = calHours[day.date];
        const n =
          raw === "" || raw === undefined ? Number(day.total) : Number(raw);
        const hoursChanged = Number.isFinite(n) && n !== Number(day.total);
        if (!hoursChanged && statusNum === null) continue;
        updates.push({
          id: day.editableId,
          hours: hoursChanged ? n : Number(day.total),
          ...(statusNum !== null ? { status: statusNum } : {}),
        });
      } else if (day.dayEntries.length > 0) {
        if (statusNum === null) continue;
        for (const entry of day.dayEntries) {
          updates.push({
            id: entry.id,
            hours: Number(entry.hours),
            status: statusNum,
          });
        }
      } else if (day.canCreate) {
        const raw = calHours[day.date];
        if (raw === "" || raw === undefined) continue;
        const n = Number(raw);
        if (!Number.isFinite(n) || n <= 0) continue;
        const projectId = calProjectId || (projects[0] && projects[0].id);
        if (!projectId) continue;
        creates.push({
          work_date: day.date,
          project_id: Number(projectId),
          hours: n,
          status: statusNum !== null ? statusNum : 0,
        });
      }
    }

    setSaving(true);
    try {
      const res = await fetch(`${getApiBase()}/worksubmit/admin/bulkUpdate`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          employee_id: Number(calEmployee),
          updates,
          creates,
        }),
      });
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
      closeCal();
      fetchData();
    } catch (err) {
      console.error("Save failed:", err.message);
      toast.error(err.message || "Network or server error!");
    } finally {
      setSaving(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({
      employee_id: "",
      project_id: "",
      work_date: "",
      hours: "",
      status: "0",
    });
    setErrors({});
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleHoursChange = (e) => {
    const v = e.target.value;
    if (v === "") {
      setForm((f) => ({ ...f, hours: "" }));
      return;
    }
    if (/^\d*\.?\d{0,2}$/.test(v)) {
      setForm((f) => ({ ...f, hours: v }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const payload = {
      employee_id: Number(form.employee_id),
      project_id: Number(form.project_id),
      work_date: form.work_date,
      hours: Number(form.hours),
      status: Number(form.status),
    };

    const localErrors = {};
    if (!payload.employee_id) localErrors.employee_id = ["Employee is required."];
    if (!payload.project_id) localErrors.project_id = ["Please select a project."];
    if (!payload.work_date) localErrors.work_date = ["Date is required."];
    if (form.hours === "" || form.hours === null) {
      localErrors.hours = ["Hours worked is required."];
    } else if (!/^\d+(\.\d{1,2})?$/.test(String(form.hours))) {
      localErrors.hours = ["Hours must be a number like 10.5."];
    } else if (payload.hours < 1) {
      localErrors.hours = ["Hours must be at least 1."];
    } else if (payload.hours > 24) {
      localErrors.hours = ["Hours cannot exceed 24 per day."];
    }
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      const url = editingId
        ? `${getApiBase()}/worksubmit/admin/updateData`
        : `${getApiBase()}/worksubmit/admin/create`;
      const body = editingId ? { id: editingId, ...payload } : payload;
      const res = await fetch(url, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 422 && data?.errors) {
        setErrors(data.errors);
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        return;
      }
      if (!res.ok) {
        throw new Error(data?.message || `HTTP Error: ${res.status}`);
      }
      toast.success(editingId ? "Entry updated" : "Entry created");
      closeForm();
      fetchData();
    } catch (err) {
      console.error("Save failed:", err.message);
      toast.error(err.message || "Network or server error!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!token) return;
    const ok = confirm(
      `Delete ${group.rows.length} entr${group.rows.length === 1 ? "y" : "ies"} of ${group.employee_name} — ${group.label}?`
    );
    if (!ok) return;
    let done = 0;
    for (const row of group.rows) {
      try {
        const res = await fetch(
          `${getApiBase()}/worksubmit/admin/delete/${row.id}`,
          { method: "DELETE", headers: authHeaders }
        );
        if (res.ok) done += 1;
      } catch (err) {
        console.error(err);
      }
    }
    if (done) {
      toast.success(`${done} entr${done === 1 ? "y" : "ies"} deleted`);
      fetchData();
    } else {
      toast.error("Delete failed");
    }
  };

  const handlePrint = () => {
    const node = document.querySelector(".aws-print");
    if (!node) {
      window.print();
      return;
    }
    const root = document.createElement("div");
    root.id = "aws-print-root";
    root.className = node.className;
    root.innerHTML = node.innerHTML;
    document.body.appendChild(root);
    const cleanup = () => {
      if (root.parentNode) root.parentNode.removeChild(root);
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    cleanup();
  };

  const badgeStyle = (kind) => {
    const map = {
      pending: { background: "#fffbeb", color: "#b45309" },
      approved: { background: "#ecfdf5", color: "#047857" },
      cancelled: { background: "#fef2f2", color: "#b91c1c" },
      mixed: { background: "#f1f5f9", color: "#475569" },
      total: { background: "#e0f2fe", color: "#0369a1" },
    };
    return map[kind] || map.total;
  };

  const columns = [
    {
      name: "SL",
      selector: (row) => row.sl,
      width: "70px",
    },
    {
      name: "Date",
      selector: (row) => row.label,
      sortable: true,
      width: "150px",
      cell: (row) => (
        <span style={{ fontSize: 13, fontWeight: 500 }}>{row.label}</span>
      ),
    },
    {
      name: "Employee Code",
      selector: (row) => row.employee_code,
      sortable: true,
      width: "130px",
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name,
      sortable: true,
      grow: 2,
    },
    {
      name: "Department",
      selector: (row) => row.department_name,
      sortable: true,
      grow: 1,
    },
    {
      name: "Project",
      selector: (row) => row.projectLabel,
      sortable: true,
      grow: 1,
      cell: (row) => row.projectLabel,
    },
    {
      name: "Hours",
      selector: (row) => row.hours,
      sortable: true,
      width: "100px",
      style: { justifyContent: "flex-end", textAlign: "right" },
      cell: (row) => (
        <span
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#065f46",
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
            borderRadius: 8,
            padding: "4px 10px",
            display: "inline-block",
          }}
        >
          {row.hours}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status.label,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 0.3,
            borderRadius: 100,
            padding: "5px 11px",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            border: "1px solid",
            ...badgeStyle(row.status.cls),
            borderColor:
              row.status.cls === "pending"
                ? "#fde68a"
                : row.status.cls === "approved"
                  ? "#a7f3d0"
                  : row.status.cls === "cancelled"
                    ? "#fecaca"
                    : "#cbd5e1",
          }}
        >
          {row.status.label}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1" style={{ whiteSpace: "nowrap" }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            title="Preview month entries"
            onClick={() => setGroupPreview(row)}
          >
            <i className="bi bi-eye me-1"></i> Preview
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete all entries of this month"
            onClick={() => handleDeleteGroup(row)}
          >
            <i className="bi bi-trash me-1"></i> Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "210px",
    },
  ];

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <style>{`
        .aws-print { display:flex; flex-direction:column; gap:14px; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        #aws-print-root { display:none; }
        .aws-print-brand { display:flex; justify-content:space-between; align-items:baseline; gap:12px; border-bottom:2px solid #0f172a; padding-bottom:8px; }
        .aws-print-brand b { font-size:16px; font-weight:600; color:#0f172a; }
        .aws-print-brand span { font-size:12px; color:#64748b; }
        .aws-print-emp { display:grid; grid-template-columns:1fr 1fr; gap:10px 16px; background:#f8fafc; border:1px solid #e5e7eb; border-radius:8px; padding:13px 14px; }
        .aws-print-emp div { display:flex; flex-direction:column; gap:3px; min-width:0; }
        .aws-print-emp span { font-size:10.5px; font-weight:500; letter-spacing:.5px; text-transform:uppercase; color:#94a3b8; }
        .aws-print-emp b { font-size:13.5px; font-weight:500; color:#0f172a; }
        .aws-print-table { width:100%; border-collapse:collapse; }
        .aws-print-table th { border:1px solid #e5e7eb; padding:9px 12px; background:#0f172a; color:#fff; text-align:left; font-size:12px; font-weight:500; }
        .aws-print-table td { border:1px solid #e5e7eb; padding:9px 12px; font-size:13.5px; color:#0f172a; }
        .aws-print-table tr.aws-total td { background:#f1f5f9; font-weight:500; }
        .aws-print-sign { display:flex; justify-content:space-between; gap:24px; margin-top:34px; }
        .aws-print-sign div { flex:1; border-top:1.5px dashed #94a3b8; padding-top:8px; font-size:12px; color:#64748b; text-align:center; }
        @media print {
          html, body { background:#fff !important; height:auto !important; overflow:visible !important; margin:0 !important; padding:0 !important; }
          body > *:not(#aws-print-root) { display:none !important; }
          #aws-print-root { position:static !important; display:block !important; width:100% !important; margin:0 !important; padding:0 !important; background:#fff !important; }
          .aws-no-print { display:none !important; }
        }

        .emp-ws-modal-back {
          position:fixed; inset:0; z-index:1060;
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
        .emp-ws-modal-head {
          background:#0f172a; color:#fff;
          padding:14px 16px; display:flex; align-items:center;
          justify-content:space-between; gap:12px; flex-shrink:0;
        }
        @media (min-width: 576px) { .emp-ws-modal-head { padding:16px 22px; } }
        .emp-ws-modal-head h3 { font-size:14px; font-weight:600; min-width:0; margin:0; color:#fff; }
        .emp-ws-modal-close, .emp-ws-modal-winbtn {
          background:none; border:none; color:#94a3b8;
          cursor:pointer; padding:6px; display:flex; border-radius:6px;
          transition:color .15s, background .15s; flex-shrink:0;
          min-width:34px; min-height:34px; align-items:center; justify-content:center;
        }
        .emp-ws-modal-close:hover, .emp-ws-modal-winbtn:hover { color:#fff; background:rgba(255,255,255,0.1); }
        .emp-ws-modal-wins { display:flex; align-items:center; gap:2px; flex-shrink:0; }
        .emp-ws-modal-body {
          padding:20px; overflow:auto; flex:1 1 auto; min-height:0;
          display:flex; flex-direction:column; gap:14px;
          overscroll-behavior:contain;
        }
        .emp-ws-field { min-width:0; }
        .emp-ws-field label {
          display:block; font-size:11px; font-weight:500;
          letter-spacing:0.5px; text-transform:uppercase;
          color:#64748b; margin-bottom:6px;
        }
        .emp-ws-field select, .emp-ws-field input {
          width:100%; height:44px; border:1.5px solid #e5e7eb;
          border-radius:8px; padding:0 12px; background:#fff;
          font-size:14px; font-weight:500; color:#0f172a;
          font-family:'Plus Jakarta Sans', sans-serif; outline:none;
          transition:border-color .15s;
        }
        .emp-ws-field select:focus, .emp-ws-field input:focus { border-color:#38bdf8; }
        .emp-ws-field .hint {
          font-size:11.5px; color:#94a3b8; font-weight:500; margin-top:5px;
        }
        .emp-ws-modal-foot {
          padding:14px 20px; border-top:1px solid #e5e7eb;
          display:flex; justify-content:flex-end; gap:10px;
          background:#fff; flex-shrink:0;
        }
        .emp-ws-btn {
          height:42px; padding:0 18px; border-radius:8px; border:1.5px solid transparent;
          font-size:13.5px; font-weight:500; cursor:pointer;
          display:inline-flex; align-items:center; justify-content:center; gap:7px;
          font-family:'Plus Jakarta Sans', sans-serif;
          transition:background .15s, box-shadow .15s, transform .15s;
        }
        .emp-ws-btn:disabled { opacity:.55; cursor:not-allowed; }
        .emp-ws-btn-ghost { background:#fff; border-color:#e5e7eb; color:#475569; }
        .emp-ws-btn-ghost:hover:not(:disabled) { background:#f8fafc; }
        .emp-ws-btn-primary { background:#0f172a; color:#fff; }
        .emp-ws-btn-primary:hover:not(:disabled) { box-shadow:0 4px 14px rgba(15,23,42,0.2); transform:translateY(-1px); }
        .emp-ws-loading {
          display:flex; align-items:center; justify-content:center; gap:10px;
          padding:26px; color:#64748b; font-size:13.5px; font-weight:500;
        }
        .emp-ws-spinner {
          width:18px; height:18px; border-radius:50%;
          border:2.5px solid #e2e8f0; border-top-color:#0f172a;
          animation:awsSpin .7s linear infinite;
        }
        @keyframes awsSpin { to { transform:rotate(360deg); } }
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
        .ts-cal-head {
          display:flex; justify-content:space-between; align-items:center;
          padding:11px 16px; background:#f8fafc;
          border-bottom:2px solid #e2e8f0;
          position:sticky; top:0; z-index:1;
          font-size:11px; font-weight:500; letter-spacing:0.5px;
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
          font-size:11px; font-weight:500; letter-spacing:0.4px;
          text-transform:uppercase; color:#94a3b8;
          border:1.5px dashed #cbd5e1; border-radius:6px; padding:5px 10px;
        }
        .ts-locked {
          font-size:14px; font-weight:500; color:#475569;
          background:#f1f5f9; border-radius:6px; padding:7px 12px;
          min-width:64px; text-align:right; display:inline-block;
        }
        .ts-total {
          display:flex; justify-content:space-between; align-items:center;
          padding:13px 16px; background:#0f172a; border-radius:10px;
          font-size:13.5px; font-weight:500; color:#cbd5e1;
        }
        .ts-total b { font-size:17px; color:#fff; font-weight:600; }
      `}</style>

      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">
                Timesheet List&nbsp;
                <span
                  className="badge"
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                    fontSize: 14,
                  }}
                >
                  {grouped.length}
                </span>
              </h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Timesheet
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
      <div className="app-content">
        <div className="container-fluid">
          <div className="row mb-3">
            {[
              { kind: "pending", label: "Pending", value: statusCounts.pending || 0 },
              { kind: "approved", label: "Approved", value: statusCounts.approved || 0 },
              { kind: "cancelled", label: "Cancelled", value: statusCounts.cancelled || 0 },
              { kind: "total", label: "Total", value: statusCounts.total || 0 },
            ].map((item) => (
              <div className="col-6 col-md-3" key={item.kind}>
                <div
                  className="card h-100"
                  style={{ border: "1px solid #e5e7eb", borderRadius: 12 }}
                >
                  <div className="card-body py-3 px-3">
                    <div
                      className="d-inline-block px-2 py-1 mb-2"
                      style={{
                        borderRadius: 100,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        ...badgeStyle(item.kind),
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 600, color: "#0f172a" }}>
                      {item.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card card-primary card-outline mb-4">
            <div
              className="card-header"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                borderBottom: "2px solid #0d6efd",
              }}
            >
              <div className="card-title w-100">
                <div className="row g-2 align-items-end">
                  <div className="col-12 col-md-3 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Search
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name or code..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-6 col-md-3 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Employee
                    </label>
                    <select
                      className="form-select"
                      value={employeeFilter}
                      onChange={(e) => setEmployeeFilter(e.target.value)}
                    >
                      <option value="">All Employees</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.employee_code || "-"})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Project
                    </label>
                    <select
                      className="form-select"
                      value={projectFilter}
                      onChange={(e) => setProjectFilter(e.target.value)}
                    >
                      <option value="">All Projects</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Status
                    </label>
                    <select
                      className="form-select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-2 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Actions
                    </label>
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        fetchDropdowns();
                        fetchData();
                      }}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                  </div>
                  <div className="col-6 col-md-2 col-lg-2 ms-auto">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      &nbsp;
                    </label>
                    <button type="button" className="btn btn-primary w-100" onClick={() => openCal()}>
                      <i className="bi bi-plus-lg me-1"></i> Add New
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <DataTable
                columns={columns}
                data={grouped}
                progressPending={loading}
                pagination
                customStyles={customStyles}
                noDataComponent={
                  <div style={{ padding: 24, color: "#9ca3af", fontWeight: 500 }}>
                    No work submissions found for the selected filters.
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {groupPreview && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(15,23,42,0.6)" }}
          onClick={() => setGroupPreview(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: 14, overflow: "hidden" }}>
              <div
                className="modal-header"
                style={{ background: "#0f172a", color: "#fff" }}
              >
                <h5 className="modal-title" style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  {`${groupPreview.label} — ${groupPreview.employee_name}`}
                </h5>
                <div className="d-flex align-items-center gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={handlePrint}
                    title="Print"
                  >
                    <i className="bi bi-printer"></i>
                  </button>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setGroupPreview(null)}
                    aria-label="Close"
                  />
                </div>
              </div>
              <div className="modal-body">
                <div className="aws-print">
                  <div className="aws-print-brand">
                    <b>Monthly TimeSheet</b>
                    <span>
                      {groupPreview.label} · Printed{" "}
                      {formatDateTime(new Date().toISOString())}
                    </span>
                  </div>

                  <div className="aws-print-emp">
                    <div>
                      <span>Employee</span>
                      <b>{groupPreview.employee_name}</b>
                    </div>
                    <div>
                      <span>Employee Code</span>
                      <b>{groupPreview.employee_code}</b>
                    </div>
                    <div>
                      <span>Department</span>
                      <b>{groupPreview.department_name}</b>
                    </div>
                    <div>
                      <span>Designation</span>
                      <b>{groupPreview.designation_name || "-"}</b>
                    </div>
                  </div>

                  <table className="aws-print-table">
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
                      {groupPreview.rows.map((row, idx) => (
                        <tr key={row.id}>
                          <td>{idx + 1}</td>
                          <td>{formatDateShort(row.work_date)}</td>
                          <td>{row.project_name || "-"}</td>
                          <td>{Number(row.hours)}</td>
                          <td>{row.status_label || statusMeta(row.status).label}</td>
                        </tr>
                      ))}
                      <tr className="aws-total">
                        <td colSpan={3}>
                          Total ({groupPreview.rows.length} entries)
                        </td>
                        <td>{groupPreview.hours} hrs</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="aws-print-sign">
                    <div>Employee Signature</div>
                    <div>Approved By</div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setGroupPreview(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    const g = groupPreview;
                    setGroupPreview(null);
                    openCal(g);
                  }}
                >
                  <i className="bi bi-pencil me-1"></i> Edit
                </button>
                <button type="button" className="btn btn-primary" onClick={handlePrint}>
                  <i className="bi bi-printer me-1"></i> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {calOpen && (
        <div className="emp-ws-modal-back" onClick={closeCal}>
          <div
            className={`emp-ws-modal size-${calSize}`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="emp-ws-modal-head">
              <h3>
                {`Create Time Sheet — ${MONTH_NAMES[Number(calMonthNum) - 1]} ${calYear}`}
              </h3>
              <div className="emp-ws-modal-wins">
                {calSize === "min" ? (
                  <button
                    type="button"
                    className="emp-ws-modal-winbtn"
                    onClick={() => setCalSize("max")}
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
                      onClick={() => setCalSize("min")}
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
                      onClick={() => setCalSize(calSize === "max" ? "normal" : "max")}
                      aria-label={calSize === "max" ? "Restore" : "Maximize"}
                      title={calSize === "max" ? "Restore" : "Maximize"}
                    >
                      {calSize === "max" ? (
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
                  onClick={closeCal}
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
              <div className="emp-ws-field">
                <label htmlFor="cal-employee">Employee</label>
                <select
                  id="cal-employee"
                  value={calEmployee}
                  onChange={(e) => setCalEmployee(e.target.value)}
                  disabled={saving || calLoading}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employee_code || "-"})
                    </option>
                  ))}
                </select>
                {!calEmployee && (
                  <div className="hint">
                    Select an employee to load their timesheet.
                  </div>
                )}
              </div>

              <div className="ts-selects">
                <div className="emp-ws-field">
                  <label htmlFor="cal-month">Month</label>
                  <select
                    id="cal-month"
                    value={calMonthNum}
                    onChange={(e) => changeCalMonth(calYear, e.target.value)}
                    disabled={saving || calLoading}
                  >
                    {MONTH_NAMES.map((name, i) => (
                      <option key={name} value={String(i + 1).padStart(2, "0")}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="emp-ws-field">
                  <label htmlFor="cal-year">Year</label>
                  <select
                    id="cal-year"
                    value={calYear}
                    onChange={(e) => changeCalMonth(e.target.value, calMonthNum)}
                    disabled={saving || calLoading}
                  >
                    {calYearOptions.map((y) => (
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
                {!calEmployee ? (
                  <div className="emp-ws-loading">Select an employee first.</div>
                ) : calLoading ? (
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
                            value={calHours[day.date] !== undefined ? calHours[day.date] : ""}
                            onChange={(e) => handleCalHoursChange(day.date, e.target.value)}
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
                <b>{calTotal.toFixed(2).replace(/\.00$/, "")}</b>
              </div>

              <div className="emp-ws-field">
                <label htmlFor="cal-project">
                  Project <span className="hint">(for new entries)</span>
                </label>
                <select
                  id="cal-project"
                  value={calProjectId}
                  onChange={(e) => setCalProjectId(e.target.value)}
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

              <div className="emp-ws-field">
                <label htmlFor="cal-status">
                  Status <span className="hint">(applies to all entries)</span>
                </label>
                <select
                  id="cal-status"
                  value={calStatus}
                  onChange={(e) => setCalStatus(e.target.value)}
                  disabled={saving}
                >
                  <option value="">No status change</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="emp-ws-modal-foot">
              <button
                type="button"
                className="emp-ws-btn emp-ws-btn-ghost"
                onClick={closeCal}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="emp-ws-btn emp-ws-btn-primary"
                onClick={handleCalSave}
                disabled={saving || calLoading}
              >
                {saving ? "Saving..." : "Save Entries"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: "rgba(15,23,42,0.6)" }}
          onClick={closeForm}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content" style={{ borderRadius: 14, overflow: "hidden" }}>
              <div
                className="modal-header"
                style={{ background: "#0f172a", color: "#fff" }}
              >
                <h5 className="modal-title" style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                  {editingId ? "Edit Time Sheet Entry" : "Create Time Sheet Entry"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeForm}
                  aria-label="Close"
                  disabled={saving}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ display: "grid", gap: 14 }}>
                  <div>
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Employee
                    </label>
                    <select
                      className="form-select"
                      name="employee_id"
                      value={form.employee_id}
                      onChange={handleFormChange}
                      disabled={saving}
                      required
                    >
                      <option value="">-- Select Employee --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} ({emp.employee_code || "-"})
                        </option>
                      ))}
                    </select>
                    {errors.employee_id && (
                      <div className="text-danger small mt-1">
                        {errors.employee_id[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Project
                    </label>
                    <select
                      className="form-select"
                      name="project_id"
                      value={form.project_id}
                      onChange={handleFormChange}
                      disabled={saving}
                      required
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.project_id && (
                      <div className="text-danger small mt-1">
                        {errors.project_id[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Date
                    </label>
                    <input
                      id="aws-date"
                      type="date"
                      className="form-control"
                      name="work_date"
                      value={form.work_date}
                      onChange={handleFormChange}
                      onClick={(e) => {
                        const el = e.currentTarget;
                        if (typeof el.showPicker === "function") {
                          try {
                            el.showPicker();
                          } catch (err) {
                            /* ignore */
                          }
                        }
                      }}
                      disabled={saving}
                      required
                    />
                    {errors.work_date && (
                      <div className="text-danger small mt-1">
                        {errors.work_date[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Hours Worked
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      className="form-control"
                      name="hours"
                      placeholder="e.g. 10.5"
                      value={form.hours}
                      onChange={handleHoursChange}
                      disabled={saving}
                    />
                    {errors.hours && (
                      <div className="text-danger small mt-1">{errors.hours[0]}</div>
                    )}
                    <div className="form-text">Decimals allowed, e.g. 10, 10.5, 3.25</div>
                  </div>

                  <div>
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Status
                    </label>
                    <select
                      className="form-select"
                      name="status"
                      value={form.status}
                      onChange={handleFormChange}
                      disabled={saving}
                    >
                      <option value="0">Pending</option>
                      <option value="1">Approved</option>
                      <option value="2">Cancelled</option>
                    </select>
                    <div className="form-text">
                      New entries start as Pending. Admin can approve or cancel.
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update Entry" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
