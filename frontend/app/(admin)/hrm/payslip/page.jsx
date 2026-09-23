"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../../components/styles/customDataTable";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function PayslipPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { token } = useAuth();

  const employeeIdParam = searchParams.get("employee_id") || "";
  const title = employeeIdParam ? "Employee Payslips" : "Payslip List";

  const [search, setSearch] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [date, setDate] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [designationFilter, setDesignationFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [viewRow, setViewRow] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");

  const getFileUrl = (row) => {
    const base = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/api\/?$/, "");
    const rel = (row?.payslip || "").replace(/^\/+/, "");
    if (rel) return `${base}/${rel}`;
    return row?.payslip_url || "";
  };

  const getApiBase = () => (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

  const openView = async (row) => {
    setViewRow(row);
    setPreviewUrl("");
    setPreviewError("");
    setPreviewLoading(false);

    const fileUrl = getFileUrl(row);
    const pathOrUrl = row?.payslip || fileUrl || "";
    const canPreview = isPdfFile(pathOrUrl) || isImageFile(pathOrUrl);

    if (!canPreview) {
      setPreviewError("unsupported");
      return;
    }

    if (isPdfFile(pathOrUrl) && row?.id) {
      setPreviewUrl(`${getApiBase()}/payslip/stream/${row.id}`);
      return;
    }

    if (!fileUrl) {
      setPreviewError("failed");
      return;
    }

    setPreviewUrl(fileUrl);
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

  React.useEffect(() => {
    return () => {
      setPreviewUrl((prev) => {
        if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
        return "";
      });
    };
  }, []);

  const openDownload = (row) => {
    const pathOrUrl = row?.payslip || getFileUrl(row) || "";
    if (isPdfFile(pathOrUrl) && row?.id) {
      window.open(
        `${getApiBase()}/payslip/stream/${row.id}`,
        "_blank",
        "noopener,noreferrer"
      );
      return;
    }
    const url = getFileUrl(row);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getFileExt = (path = "") => {
    const clean = (path || "").split("?")[0].split("#")[0];
    const parts = clean.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  };

  const isImageFile = (url = "") =>
    ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(
      getFileExt(url)
    );

  const isPdfFile = (url = "") => getFileExt(url) === "pdf";

  const isTextFile = (url = "") =>
    ["txt", "csv", "log", "json", "xml", "md"].includes(getFileExt(url));

  const isOfficeFile = (url = "") =>
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "rtf", "odt", "ods", "odp"].includes(
      getFileExt(url)
    );

  const getFileIcon = (url = "") => {
    const ext = getFileExt(url);
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"].includes(ext))
      return "bi-file-earmark-image";
    if (ext === "pdf") return "bi-file-earmark-pdf";
    if (["doc", "docx", "rtf", "odt"].includes(ext))
      return "bi-file-earmark-word";
    if (["xls", "xlsx", "ods", "csv"].includes(ext))
      return "bi-file-earmark-excel";
    if (["ppt", "pptx", "odp"].includes(ext))
      return "bi-file-earmark-powerpoint";
    if (["zip", "rar", "7z"].includes(ext)) return "bi-file-earmark-zip";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return "bi-file-earmark-image";
    return "bi-file-earmark";
  };

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  const fetchDropdowns = async () => {
    if (!token) return;
    try {
      const [deptRes, desigRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/department/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/designation/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
      ]);
      const dept = await deptRes.json();
      const desig = await desigRes.json();
      setDepartments(dept.data || []);
      setDesignations(desig.data || []);
    } catch (err) {
      console.error("Fetch dropdowns failed:", err.message);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, [token]);

  const fetchData = useCallback(
    async (currentPage = 1, pageSize = 10, searchQuery = "") => {
      setLoading(true);
      try {
        let url;
        if (employeeIdParam) {
          const params = new URLSearchParams({
            page: currentPage,
            pageSize: pageSize,
          });
          url = `${process.env.NEXT_PUBLIC_API_BASE}/payslip/employee/${employeeIdParam}?${params.toString()}`;
        } else {
          const params = new URLSearchParams({
            page: currentPage,
            pageSize: pageSize,
            searchQuery: searchQuery,
            employeeCode: employeeCode,
            date: date,
            departmentId: departmentFilter,
            designationId: designationFilter,
          });
          url = `${process.env.NEXT_PUBLIC_API_BASE}/payslip/index?${params.toString()}`;
        }

        const res = await fetch(url, { headers: authHeaders });
        let result;
        try {
          result = await res.json();
        } catch (e) {
          result = null;
        }

        if (!res.ok) {
          throw new Error(result?.message || `HTTP Error: ${res.status}`);
        }

        if (employeeIdParam && result.employee) {
          setEmployeeInfo(result.employee);
        }
        setData(result.data || []);
        setTotalRows(result.total_records || 0);
      } catch (err) {
        console.error("Fetch payslips failed:", err.message);
        toast.error(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    },
    [
      employeeIdParam,
      search,
      employeeCode,
      date,
      departmentFilter,
      designationFilter,
      token,
    ]
  );

  useEffect(() => {
    fetchData(page, perPage, search);
  }, [page, perPage, search, fetchData]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/payslip/delete/${id}`,
        { method: "DELETE", headers: authHeaders }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Delete failed");
        return;
      }
      toast.success("Deleted successfully");
      fetchData(page, perPage, search);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

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

  const getFileName = (path) => {
    if (!path) return "-";
    return path.split("/").pop();
    };

  const columns = employeeIdParam
    ? [
        {
          name: "Date",
          selector: (row) => row.selected_date,
          sortable: true,
          width: "160px",
          cell: (row) => <span>{formatDate(row.selected_date)}</span>,
        },
        {
          name: "Payslip",
          selector: (row) => row.payslip,
          grow: 2,
          cell: (row) => (
            <span style={{ fontSize: 14 }}>{getFileName(row.payslip)}</span>
          ),
        },
        {
          name: "Action",
          cell: (row) => (
            <div className="d-flex gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                title="View"
                onClick={() => openView(row)}
              >
                <i className="bi bi-eye"></i> View
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                title="Download"
                onClick={() => openDownload(row)}
              >
                <i className="bi bi-download"></i> Download
              </button>
            </div>
          ),
          ignoreRowClick: true,
          width: "300px",
        },
      ]
    : [
        {
          name: "SL",
          selector: (row, idx) => idx + 1 + (page - 1) * perPage,
          width: "70px",
        },
        {
          name: "Selected Date",
          selector: (row) => row.selected_date,
          sortable: true,
          width: "130px",
          cell: (row) => <span>{formatDate(row.selected_date)}</span>,
        },
        {
          name: "Employee Code",
          selector: (row) => row.employee_code || "-",
          sortable: true,
          width: "130px",
        },
        {
          name: "Employee Name",
          selector: (row) => row.employee_name || "-",
          sortable: true,
          grow: 2,
        },
        {
          name: "Department",
          selector: (row) => row.department_name || "-",
          sortable: true,
          grow: 1,
        },
        {
          name: "Designation",
          selector: (row) => row.designation_name || "-",
          sortable: true,
          grow: 1,
        },
       
        {
          name: "Created Date",
          selector: (row) => row.created_at,
          sortable: true,
          width: "130px",
          cell: (row) => (
            <span style={{ fontSize: 13 }}>
              {row.created_at
                ? new Date(row.created_at).toLocaleDateString()
                : "-"}
            </span>
          ),
        },
        {
          name: "Actions",
          cell: (row) => (
            <div
              className="d-flex align-items-center flex-nowrap"
              style={{ gap: 6, whiteSpace: "nowrap" }}
            >
              <button
                className="btn btn-sm btn-outline-primary"
                title="View"
                onClick={() => openView(row)}
              >
                <i className="bi bi-eye me-1"></i> View
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                title="Download"
                onClick={() => openDownload(row)}
              >
                <i className="bi bi-download me-1"></i> Download
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                title="Edit"
                onClick={() => router.push(`/hrm/payslip/edit?id=${row.id}`)}
              >
                <i className="bi bi-pencil me-1"></i> Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                title="Delete"
                onClick={() => handleDelete(row.id)}
              >
                <i className="bi bi-trash me-1"></i> Delete
              </button>
            </div>
          ),
          ignoreRowClick: true,
          width: "360px",
        },
      ];

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
          {employeeIdParam && employeeInfo && (
            <div
              className="alert mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2"
              style={{
                background: "linear-gradient(135deg, #e7f1ff, #f3e8ff)",
                border: "1px solid #cfe2ff",
              }}
            >
              <div>
                <strong style={{ color: "#0d3c78" }}>
                  Employee: {employeeInfo.name}
                </strong>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  {employeeInfo.employee_code} | {employeeInfo.department_name}{" "}
                  | {employeeInfo.designation_name}
                </div>
              </div>
              <Link href="/hrm/payslip" className="btn btn-sm btn-outline-primary">
                <i className="bi bi-arrow-left me-1"></i> All Payslips
              </Link>
            </div>
          )}

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
                  {!employeeIdParam && (
                    <>
                      <div className="col-12 col-md-3 col-lg-2">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Employee Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search name..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-3 col-lg-2">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Employee Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search code..."
                          value={employeeCode}
                          onChange={(e) => setEmployeeCode(e.target.value)}
                        />
                      </div>
                      <div className="col-6 col-md-3 col-lg-2">
                        <label className="form-label small fw-semibold text-muted mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
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
                    </>
                  )}
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
                          background:
                            "linear-gradient(135deg, #0d6efd, #6610f2)",
                          color: "#fff",
                          border: "none",
                        }}
                        onClick={() => router.push("/hrm/payslip/add")}
                      >
                        <i className="bi bi-plus-lg me-1"></i> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <DataTable
                columns={columns}
                data={data}
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={setPage}
                onChangeRowsPerPage={setPerPage}
                customStyles={{
                  ...customStyles,
                  table: {
                    style: { width: "100%", minWidth: "100%" },
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
                    style: { minHeight: "56px" },
                  },
                }}
                responsive
                highlightOnHover
                striped
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Payslip Modal */}
      {viewRow && (
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
                <h5
                  className="modal-title mb-0 d-flex align-items-center"
                  style={{ gap: 8 }}
                >
                  <i
                    className={`${getFileIcon(viewRow.payslip)}`}
                    style={{
                      display: "inline-block",
                      fontSize: "1.25rem",
                      lineHeight: 1,
                      verticalAlign: "middle",
                    }}
                  ></i>
                  <span className="text-truncate">
                    {getFileName(viewRow.payslip)}
                    {viewRow.selected_date
                      ? ` — ${formatDate(viewRow.selected_date)}`
                      : ""}
                  </span>
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeView}
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body p-0"
                style={{ background: "#f4f6f9", minHeight: "420px" }}
              >
                {!viewRow.payslip && !viewRow.payslip_url ? (
                  <div className="text-center py-5 text-muted">
                    <i
                      className="bi bi-file-earmark-x mb-3"
                      style={{ display: "inline-block", fontSize: "3rem", lineHeight: 1 }}
                    ></i>
                    <div>No file available</div>
                  </div>
                ) : previewLoading ? (
                  <div className="text-center py-5">
                    <div
                      className="spinner-border text-primary mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="text-muted">Loading preview...</div>
                  </div>
                ) : previewError === "unsupported" ? (
                  <div className="text-center py-5 px-3">
                    <i
                      className={`${getFileIcon(viewRow.payslip)} text-primary mb-3`}
                      style={{ display: "inline-block", fontSize: "4rem", lineHeight: 1 }}
                    ></i>
                    <h5 className="mb-2">{getFileName(viewRow.payslip)}</h5>
                    <p className="text-muted mb-4">
                      Only PDF or image files can be previewed (
                      {getFileExt(viewRow.payslip)?.toUpperCase() || "FILE"} is
                      not supported). Use Download to open it.
                    </p>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => openDownload(viewRow)}
                    >
                      <i className="bi bi-download me-1"></i> Download File
                    </button>
                  </div>
                ) : previewError === "failed" ? (
                  <div className="text-center py-5 px-3">
                    <i
                      className="bi bi-exclamation-triangle text-warning mb-3"
                      style={{ display: "inline-block", fontSize: "3rem", lineHeight: 1 }}
                    ></i>
                    <h5 className="mb-2">Could not load preview</h5>
                    <p className="text-muted mb-4">
                      {getFileName(viewRow.payslip)}
                    </p>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => openDownload(viewRow)}
                    >
                      <i className="bi bi-download me-1"></i> Download File
                    </button>
                  </div>
                ) : !previewUrl ? (
                  <div className="text-center py-5 text-muted">
                    <div
                      className="spinner-border text-primary mb-3"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div>Preparing preview...</div>
                  </div>
                ) : isImageFile(viewRow.payslip || previewUrl) ? (
                  <div
                    className="d-flex align-items-center justify-content-center p-3"
                    style={{
                      width: "100%",
                      minHeight: "70vh",
                      background: "#fff",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt={getFileName(viewRow.payslip)}
                      onError={() => setPreviewError("failed")}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "70vh",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        display: "block",
                      }}
                    />
                  </div>
                ) : isPdfFile(viewRow.payslip || previewUrl) ? (
                  <iframe
                    src={previewUrl}
                    title={getFileName(viewRow.payslip)}
                    type="application/pdf"
                    style={{
                      width: "100%",
                      height: "70vh",
                      border: "none",
                      background: "#fff",
                      display: "block",
                    }}
                  />
                ) : (
                  <div className="text-center py-5 px-3">
                    <i
                      className={`${getFileIcon(viewRow.payslip)} text-primary mb-3`}
                      style={{ display: "inline-block", fontSize: "4rem", lineHeight: 1 }}
                    ></i>
                    <h5 className="mb-2">{getFileName(viewRow.payslip)}</h5>
                    <p className="text-muted mb-4">
                      Only PDF or image files can be previewed. Use Download to
                      open it.
                    </p>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => openDownload(viewRow)}
                    >
                      <i className="bi bi-download me-1"></i> Download File
                    </button>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-white">
                <button
                  type="button"
                  className="btn btn-success"
                  disabled={!viewRow?.payslip && !viewRow?.payslip_url}
                  onClick={() => openDownload(viewRow)}
                >
                  <i className="bi bi-download me-1"></i> Download
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={closeView}
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
