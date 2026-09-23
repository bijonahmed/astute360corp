"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../../components/styles/customDataTable";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function EmployeePage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Employee List";
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [statusFilter, setStatusFilter] = useState("");
  const [employeeStatusFilter, setEmployeeStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [printRow, setPrintRow] = useState(null);
  const [printDetails, setPrintDetails] = useState(null);
  const [printLoading, setPrintLoading] = useState(false);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchDropdowns = async () => {
    if (!token) return;
    try {
      const [projRes, deptRes, desigRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/project/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/department/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/designation/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
      ]);
      const proj = await projRes.json();
      const dept = await deptRes.json();
      const desig = await desigRes.json();
      setProjects(proj.data || []);
      setDepartments(dept.data || []);
      setDesignations(desig.data || []);
    } catch (err) {
      console.error("Fetch dropdowns failed:", err.message);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, [token]);

  const fetchData = async (
    currentPage = 1,
    pageSize = 10,
    searchQuery = ""
  ) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: currentPage,
        pageSize: pageSize,
        searchQuery: searchQuery,
        selectedFilter: statusFilter,
        employeeStatus: employeeStatusFilter,
        projectId: projectFilter,
        departmentId: departmentFilter,
        designationId: designationFilter,
      });
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/employee/index?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: authHeaders,
      });

      let result;
      try {
        result = await res.json();
      } catch (e) {
        result = null;
      }

      if (!res.ok) {
        if (result && result.message) {
          throw new Error(result.message);
        } else {
          throw new Error(`HTTP Error: ${res.status}`);
        }
      }
      setData(result.data || []);
      setTotalRows(result.total_records || 0);
    } catch (err) {
      console.error("Fetch employees failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employee/delete/${id}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }
      toast.success("Deleted successfully");
      fetchData();
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchData(page, perPage, search);
  }, [page, perPage, search]);

  const val = (v) => (v === null || v === undefined || v === "" ? "-" : v);

  const SECTION_COLORS = [
    { bg: "#e7f1ff", border: "#0d6efd", text: "#0d6efd", th: "#d6e4ff" },
    { bg: "#e8f5e9", border: "#198754", text: "#146c43", th: "#d4edda" },
    { bg: "#fff3cd", border: "#ffc107", text: "#997404", th: "#fff3cd" },
    { bg: "#e7f5ff", border: "#0dcaf0", text: "#087990", th: "#cff4fc" },
    { bg: "#f3e8ff", border: "#6f42c1", text: "#59359a", th: "#e2d9f3" },
    { bg: "#ffe8d6", border: "#fd7e14", text: "#b85100", th: "#ffe0cc" },
    { bg: "#e0f7fa", border: "#20c997", text: "#0f766e", th: "#d0f2f5" },
    { bg: "#fce4ec", border: "#d63384", text: "#a61e5a", th: "#f8d7e3" },
  ];

  const getPhotoSrc = (emp) => {
    const raw = emp?.photo_url || emp?.photo || printRow?.photo || "";
    if (!raw) return "";
    if (
      raw.startsWith("http://") ||
      raw.startsWith("https://") ||
      raw.startsWith("data:")
    ) {
      return raw;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "";
    const origin = apiBase.replace(/\/api\/?$/, "");
    if (raw.startsWith("/")) return origin + raw;
    return `${origin}/${raw}`;
  };

  const toDataURL = (url) =>
    new Promise((resolve) => {
      if (!url) return resolve("");
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            canvas.getContext("2d").drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } catch (e) {
            resolve(url);
          }
        };
        img.onerror = () => resolve(url);
        img.src = url;
      } catch (e) {
        resolve("");
      }
    });

  const handleOpenPrint = async (row) => {
    setPrintRow(row);
    setPrintDetails(null);
    setPrintLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employee/chkrow/${row.id}`,
        { headers: authHeaders }
      );
      const result = await res.json();
      if (res.ok && result.data) {
        const merged = { ...row, ...result.data };
        merged.photo_src = getPhotoSrc(merged);
        setPrintDetails(merged);
      } else {
        const fallback = { ...row, photo_src: getPhotoSrc(row) };
        setPrintDetails(fallback);
        toast.error(result.message || "Failed to load employee details");
      }
    } catch (err) {
      console.error(err);
      setPrintDetails({ ...row, photo_src: getPhotoSrc(row) });
      toast.error("Failed to load employee details");
    } finally {
      setPrintLoading(false);
    }
  };

  const handleClosePrint = () => {
    setPrintRow(null);
    setPrintDetails(null);
    setPrintLoading(false);
  };

  const buildPrintSections = (emp) => {
    const projectName = emp.project_name || emp.project?.name || "";
    const departmentName = emp.department_name || emp.department?.name || "";
    const designationName = emp.designation_name || emp.designation?.name || "";

    return [
      {
        title: "Particular Info",
        rows: [
          ["Name", val(emp.name)],
          ["Mobile", val(emp.mobile)],
          ["Email", val(emp.email)],
        ],
      },
      {
        title: "Personal Information",
        rows: [
          ["Employee Code", val(emp.employee_code)],
          ["Father Name", val(emp.father_name)],
          ["Mother Name", val(emp.mother_name)],
          ["Date of Birth", val(emp.date_of_birth)],
          ["Age", val(emp.age)],
          ["Gender", val(emp.gender)],
          ["Marital Status", val(emp.marital_status)],
          ["Blood Group", val(emp.blood_group)],
        ],
      },
      {
        title: "Contact Information",
        rows: [
          ["Alternative Mobile", val(emp.alternative_mobile)],
          ["Present Address", val(emp.present_address)],
          ["Permanent Address", val(emp.permanent_address)],
          ["Emergency Contact Name", val(emp.emergency_contact_name)],
          ["Emergency Contact Mobile", val(emp.emergency_contact_mobile)],
          ["Emergency Contact Relation", val(emp.emergency_contact_relation)],
        ],
      },
      {
        title: "Job Information",
        rows: [
          ["Project", projectName || "-"],
          ["Department", departmentName || "-"],
          ["Designation", designationName || "-"],
          ["Joining Date", val(emp.joining_date)],
          ["Employment Type", val(emp.employment_type)],
          ["Employee Status", val(emp.employee_status)],
          ["Reporting To", val(emp.reporting_to)],
          ["Work Location", val(emp.work_location)],
          ["Shift", val(emp.shift)],
          ["Basic Salary", val(emp.basic_salary)],
          ["Gross Salary", val(emp.gross_salary)],
        ],
      },
      {
        title: "Identity & Documents",
        rows: [
          ["NID Number", val(emp.nid_number)],
          ["Passport Number", val(emp.passport_number)],
          ["Passport Expiry Date", val(emp.passport_expiry_date)],
          ["Birth Certificate Number", val(emp.birth_certificate_number)],
          ["Driving License Number", val(emp.driving_license_number)],
        ],
      },
      {
        title: "Bank & Payment",
        rows: [
          ["Bank Name", val(emp.bank_name)],
          ["Bank Account Name", val(emp.bank_account_name)],
          ["Bank Account Number", val(emp.bank_account_number)],
          ["Branch Name", val(emp.branch_name)],
          ["Routing Number", val(emp.routing_number)],
          ["Payment Method", val(emp.payment_method)],
        ],
      },
      {
        title: "Education",
        rows: [
          ["Highest Education", val(emp.highest_education)],
          ["Institution Name", val(emp.institution_name)],
          ["Passing Year", val(emp.passing_year)],
        ],
      },
      {
        title: "System Information",
        rows: [
          ["Username", val(emp.username)],
          [
            "Status",
            val(
              emp.status == 1 || emp.status === "1"
                ? "Active"
                : emp.status == 0 || emp.status === "0"
                ? "Inactive"
                : emp.status
            ),
          ],
          ["Remarks", val(emp.remarks)],
        ],
      },
    ];
  };

  const handlePrint = async () => {
    const emp = printDetails || printRow;
    if (!emp) return;

    const photoUrl = emp.photo_src || getPhotoSrc(emp);
    const photoData = await toDataURL(photoUrl);

    const sectionsHtml = buildPrintSections(emp)
      .map((section) => {
        return `
        <div class="section-title">${section.title}</div>
        <table>
          ${section.rows
            .map(
              ([label, value]) => `
            <tr>
              <th>${label}</th>
              <td>${value}</td>
            </tr>`
            )
            .join("")}
        </table>
      `;
      })
      .join("");

    const photoHtml = photoData
      ? `<img src="${photoData}" alt="Photo" style="width:100px;height:100px;object-fit:cover;border-radius:50%;border:2px solid #333;" />`
      : `<div style="width:100px;height:100px;border-radius:50%;background:#eee;color:#333;display:flex;align-items:center;justify-content:center;font-size:40px;font-weight:bold;border:2px solid #333;">${(
          emp.name || ""
        ).charAt(0).toUpperCase()}</div>`;

    const printWindow = window.open("", "", "width=900,height=800");

    printWindow.document.write(`
      <html>
        <head>
          <title>Employee - ${emp.name || "Print"}</title>
          <style>
            body { padding: 30px; font-family: Arial, sans-serif; color: #000; background: #fff; }
            .print-header {
              text-align: center;
              margin-bottom: 18px;
              padding: 14px;
              border: 2px solid #000;
              border-radius: 6px;
            }
            .print-header h2 { margin: 0 0 4px 0; letter-spacing: 1px; color: #000; }
            .print-header p { margin: 0; color: #333; }
            .emp-top {
              display: flex;
              align-items: center;
              gap: 20px;
              margin-bottom: 10px;
              padding: 14px 16px;
              border: 1px solid #999;
              border-radius: 6px;
            }
            .emp-top strong { font-size: 18px; color: #000; }
            .emp-top span { color: #333; }
            .section-title {
              margin: 18px 0 0 0;
              font-size: 14px;
              font-weight: bold;
              padding: 7px 10px;
              background: #f0f0f0;
              border-left: 4px solid #000;
              color: #000;
            }
            table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
            th, td { border: 1px solid #999; padding: 7px 10px; font-size: 13.5px; text-align: left; vertical-align: top; color: #000; }
            th { background-color: #f5f5f5; width: 35%; font-weight: 600; }
            .print-footer {
              margin-top: 25px;
              text-align: right;
              font-size: 12px;
              color: #555;
              border-top: 1px dashed #999;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Employee Information</h2>
            <p>Print Date: ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="emp-top">
            ${photoHtml}
            <div>
              <strong>${val(emp.name)}</strong><br/>
              <span>${val(emp.mobile)}</span> &nbsp;|&nbsp; <span>${val(
        emp.email
      )}</span>
            </div>
          </div>
          ${sectionsHtml}
          <div class="print-footer">Generated from HRM Employee Module</div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const statusBadge = (status) => {
    const map = {
      Active: { bg: "#d4edda", color: "#146c43" },
      Inactive: { bg: "#e9ecef", color: "#495057" },
      Resigned: { bg: "#fff3cd", color: "#997404" },
      Terminated: { bg: "#f8d7da", color: "#842029" },
    };
    const s = map[status] || { bg: "#e7f1ff", color: "#0d6efd" };
    return (
      <span
        className="badge"
        style={{
          backgroundColor: s.bg,
          color: s.color,
          fontSize: 12,
          padding: "6px 10px",
          borderRadius: 20,
          fontWeight: 600,
        }}
      >
        {status || "-"}
      </span>
    );
  };

  const columns = [
    {
      name: "Photo",
      width: "70px",
      cell: (row) =>
        row.photo ? (
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <img
              src={row.photo}
              alt={row.name}
              width={44}
              height={44}
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                border: "2px solid #0d6efd",
                boxShadow: "0 0 0 2px #e7f1ff",
              }}
            />
          </div>
        ) : (
          <div
            className="text-white d-flex align-items-center justify-content-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              fontSize: 16,
              fontWeight: 700,
              background: "linear-gradient(135deg, #0d6efd, #6610f2)",
              border: "2px solid #ffffff",
              boxShadow: "0 0 0 2px #e7f1ff",
            }}
          >
            {(row.name || "").charAt(0).toUpperCase()}
          </div>
        ),
    },
    {
      name: "Emp. Code",
      selector: (row) => row.employee_code || "-",
      sortable: true,
      width: "120px",
    },
    {
      name: "Particular Info",
      selector: (row) => row.name,
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div style={{ padding: "8px 0", lineHeight: 1.45 }}>
          <div className="fw-bold" style={{ color: "#0d3c78" }}>
            {row.name || "-"}
          </div>
          <div style={{ color: "#495057", fontSize: 13 }}>
            {row.mobile || "-"}
          </div>
          <div style={{ color: "#6c757d", fontSize: 13, wordBreak: "break-all" }}>
            {row.email || "-"}
          </div>
        </div>
      ),
    },
    {
      name: "Job Info",
      selector: (row) => row.designation_name || "",
      sortable: true,
      grow: 2,
      cell: (row) => (
        <div style={{ padding: "8px 0", lineHeight: 1.45 }}>
          <div style={{ color: "#212529", fontSize: 14 }}>
            {row.designation_name || "-"}
          </div>
          <div style={{ color: "#6c757d", fontSize: 13 }}>
            {row.department_name || "-"}
          </div>
          <div style={{ color: "#0d6efd", fontSize: 13 }}>
            {row.project_name || "-"}
          </div>
        </div>
      ),
    },
    {
      name: "Joining Date",
      selector: (row) => row.joining_date || "-",
      sortable: true,
      width: "130px",
      cell: (row) => (
        <span style={{ fontSize: 14 }}>{row.joining_date || "-"}</span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
      cell: (row) => statusBadge(row.status),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-1">
          <button
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            onClick={() => router.push(`/hrm/employee/edit?id=${row.id}`)}
          >
            <i className="bi bi-pencil"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            title="Print"
            onClick={() => handleOpenPrint(row)}
          >
            <i className="bi bi-printer"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-info"
            title="Payslips"
            onClick={() =>
              router.push(`/hrm/payslip?employee_id=${row.id}`)
            }
          >
            <i className="bi bi-cash-stack"></i>
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "180px",
    },
  ];

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePerRowsChange = (newPerPage) => setPerPage(newPerPage);

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">
                {title}&nbsp;
                <span
                  className="badge"
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                    fontSize: 14,
                  }}
                >
                  {totalRows}
                </span>
              </h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
      <div className="app-content">
        <div className="container-fluid">
          <div className="card card-primary card-outline mb-4">
            {/* Filter Header */}
            <div
              className="card-header"
              style={{
                background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                borderBottom: "2px solid #0d6efd",
              }}
            >
              <div className="card-title w-100">
                <div className="row g-2 align-items-end">
                  <div className="col-12 col-md-4 col-lg-3">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Search
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text"
                        style={{ background: "#fff", borderColor: "#ced4da" }}
                      >
                        <i className="bi bi-search"></i>
                      </span>
                      <input
                        type="text"
                        placeholder="Name / Code / Mobile..."
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
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
                      Department
                    </label>
                    <select
                      className="form-select"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="">All Departments</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Designation
                    </label>
                    <select
                      className="form-select"
                      value={designationFilter}
                      onChange={(e) => setDesignationFilter(e.target.value)}
                    >
                      <option value="">All Designations</option>
                      {designations.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-3 col-lg-2">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Employee Status
                    </label>
                    <select
                      className="form-select"
                      value={employeeStatusFilter}
                      onChange={(e) => setEmployeeStatusFilter(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Resigned">Resigned</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-6 col-lg-auto ms-auto">
                    <label className="form-label small fw-semibold text-muted mb-1">
                      Actions
                    </label>
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => fetchData(1, perPage, search)}
                      >
                        <i className="bi bi-funnel me-1"></i> Fetch
                      </button>
                      <button
                        className="btn"
                        style={{
                          background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                          color: "#fff",
                          border: "none",
                        }}
                        onClick={() => router.push(`/hrm/employee/add/`)}
                      >
                        <i className="bi bi-plus-lg me-1"></i> Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row g-2 mt-1 d-none">
                  <div className="col-4 col-md-3 col-lg-2">
                    <select
                      className="form-select form-select-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">System: All</option>
                      <option value="1">System: Active</option>
                      <option value="0">System: Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="card-body p-0">
              <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                customStyles={{
                  ...customStyles,
                  table: {
                    style: {
                      width: "100%",
                      minWidth: "100%",
                    },
                  },
                  headCells: {
                    style: {
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.4px",
                      backgroundColor: "#f1f3f5",
                      color: "#0d3c78",
                      borderBottom: "2px solid #0d6efd",
                      justifyContent: "flex-start",
                    },
                  },
                  cells: {
                    style: {
                      fontSize: "14px",
                      borderBottom: "1px solid #f1f3f5",
                    },
                  },
                  rows: {
                    style: {
                      minHeight: "64px",
                    },
                  },
                }}
                responsive
                highlightOnHover
                striped
                pointerOnHover={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Print Preview Modal */}
      {printRow && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-hidden="true"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.55)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div
              className="modal-content border-0 shadow-lg"
              style={{ borderRadius: 12, overflow: "hidden" }}
            >
              <div
                className="modal-header text-white"
                style={{
                  background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                }}
              >
                <h5 className="modal-title mb-0">
                  <i className="bi bi-person-badge me-2"></i>
                  Employee Print Preview
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleClosePrint}
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body"
                id="employeePrintArea"
                style={{ background: "#f4f6f9" }}
              >
                {printLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary"
                      role="status"
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">
                      Loading employee details...
                    </p>
                  </div>
                ) : (
                  (() => {
                    const emp = printDetails || printRow;
                    const sections = buildPrintSections(emp);
                    const photo = emp.photo_src || getPhotoSrc(emp) || "";
                    return (
                      <>
                        <div
                          className="d-flex align-items-center gap-3 mb-4 p-3 rounded-3 shadow-sm"
                          style={{
                            background:
                              "linear-gradient(135deg, #e7f1ff, #f3e8ff)",
                            border: "1px solid #cfe2ff",
                          }}
                        >
                          {photo ? (
                            <img
                              src={photo}
                              alt={emp.name}
                              style={{
                                width: 84,
                                height: 84,
                                objectFit: "cover",
                                borderRadius: "50%",
                                border: "4px solid #0d6efd",
                                boxShadow: "0 0 0 4px #e7f1ff",
                              }}
                            />
                          ) : (
                            <div
                              className="text-white d-flex align-items-center justify-content-center"
                              style={{
                                width: 84,
                                height: 84,
                                borderRadius: "50%",
                                fontSize: 30,
                                fontWeight: 700,
                                background:
                                  "linear-gradient(135deg, #0d6efd, #6610f2)",
                                border: "4px solid #ffffff",
                              }}
                            >
                              {(emp.name || "").charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h5
                              className="mb-1 fw-bold"
                              style={{ color: "#0d3c78" }}
                            >
                              {val(emp.name)}
                            </h5>
                            <div style={{ color: "#495057" }}>
                              <span className="me-2">
                                <i className="bi bi-phone me-1"></i>
                                {val(emp.mobile)}
                              </span>
                              <span>
                                <i className="bi bi-envelope me-1"></i>
                                {val(emp.email)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {sections.map((section, idx) => {
                          const c = SECTION_COLORS[idx % SECTION_COLORS.length];
                          return (
                            <div key={section.title} className="mb-3">
                              <div
                                className="fw-bold px-3 py-2"
                                style={{
                                  background: c.bg,
                                  color: c.text,
                                  borderLeft: `6px solid ${c.border}`,
                                  borderRadius: "6px 6px 0 0",
                                  fontSize: 14,
                                }}
                              >
                                {section.title}
                              </div>
                              <table
                                className="table table-bordered mb-0"
                                style={{ background: "#fff" }}
                              >
                                <tbody>
                                  {section.rows.map(([label, value]) => (
                                    <tr key={label}>
                                      <th
                                        style={{
                                          width: "35%",
                                          backgroundColor: c.th,
                                          color: c.text,
                                        }}
                                      >
                                        {label}
                                      </th>
                                      <td
                                        style={{
                                          background: "#fff",
                                          color: "#212529",
                                        }}
                                      >
                                        {value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()
                )}
              </div>
              <div className="modal-footer bg-white">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePrint}
                  disabled={printLoading}
                  style={{
                    background: "linear-gradient(135deg, #0d6efd, #6610f2)",
                    border: "none",
                  }}
                >
                  <i className="bi bi-printer me-1"></i> Print
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleClosePrint}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
