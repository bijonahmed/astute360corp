"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function PayslipAddPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [fileName, setFileName] = useState("");
  const title = "Payslip Add";

  const [formData, setFormData] = useState({
    selected_date: "",
    employee_id: "",
  });

  useEffect(() => {
    if (title) document.title = title;
  }, []);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchEmployees = async (q = "") => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employee/index?page=1&pageSize=50&searchQuery=${encodeURIComponent(
          q
        )}&selectedFilter=`,
        { headers: authHeaders }
      );
      const result = await res.json();
      setEmployees(result.data || []);
    } catch (err) {
      console.error("Fetch employees failed:", err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees(employeeSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [employeeSearch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const allowedExts = ["pdf", "jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
      const ext = (file.name.split(".").pop() || "").toLowerCase();
      if (!allowedExts.includes(ext)) {
        toast.error("Allowed file types: PDF, JPG, JPEG, PNG, GIF, WEBP, BMP, SVG");
        e.target.value = "";
        setFileName("");
        return;
      }
      if (file.size > 500 * 1024 * 1024) {
        toast.error("File size must be max 500MB");
        e.target.value = "";
        setFileName("");
        return;
      }
    } else {
      setFileName("");
    }
  };

  const selectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setFormData({ ...formData, employee_id: emp.id });
    setEmployeeSearch(`${emp.name} (${emp.employee_code || "-"})`);
    setShowEmployeeDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const fileInput = e.target.payslip;
    if (!formData.selected_date) {
      setErrors({ selected_date: ["Date is required"] });
      toast.error("Date is required");
      return;
    }
    if (!formData.employee_id) {
      setErrors({ employee_id: ["Employee is required"] });
      toast.error("Employee is required");
      return;
    }
    if (!fileInput.files?.[0]) {
      setErrors({ payslip: ["Payslip file is required"] });
      toast.error("Payslip file is required");
      return;
    }

    const body = new FormData();
    body.append("selected_date", formData.selected_date);
    body.append("employee_id", formData.employee_id);
    body.append("payslip", fileInput.files[0]);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/payslip/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Saved successfully");
        router.push("/hrm/payslip");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        setErrors(data.errors);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  const handleReset = () => {
    setFormData({ selected_date: "", employee_id: "" });
    setSelectedEmployee(null);
    setEmployeeSearch("");
    setFileName("");
    setErrors({});
    const fileInput = document.getElementById("payslip");
    if (fileInput) fileInput.value = "";
  };

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-md-8 col-lg-6">
              <div className="card card-primary card-outline mb-4">
                <Toaster position="top-right" />
                <form onSubmit={handleSubmit}>
                  <div className="card-header">
                    <h3 className="card-title mb-0">
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      Payslip Information
                    </h3>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${
                          errors.selected_date ? "is-invalid" : ""
                        }`}
                        name="selected_date"
                        value={formData.selected_date}
                        onChange={handleChange}
                      />
                      {errors.selected_date && (
                        <div className="invalid-feedback">
                          {errors.selected_date[0]}
                        </div>
                      )}
                    </div>

                    <div className="mb-3 position-relative">
                      <label className="form-label">
                        Employee <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.employee_id ? "is-invalid" : ""
                        }`}
                        placeholder="Search employee name or code..."
                        value={employeeSearch}
                        onChange={(e) => {
                          setEmployeeSearch(e.target.value);
                          setShowEmployeeDropdown(true);
                          setSelectedEmployee(null);
                          setFormData({ ...formData, employee_id: "" });
                        }}
                        onFocus={() => setShowEmployeeDropdown(true)}
                        autoComplete="off"
                      />
                      {showEmployeeDropdown && employeeSearch && (
                        <div
                          className="position-absolute w-100 shadow-sm border rounded mt-1"
                          style={{
                            background: "#fff",
                            maxHeight: "220px",
                            overflowY: "auto",
                            zIndex: 1050,
                          }}
                        >
                          {employees.length === 0 ? (
                            <div className="p-2 text-muted">No employees found</div>
                          ) : (
                            employees.map((emp) => (
                              <div
                                key={emp.id}
                                className="p-2 cursor-pointer"
                                style={{ cursor: "pointer", borderBottom: "1px solid #f1f3f5" }}
                                onClick={() => selectEmployee(emp)}
                              >
                                <strong>{emp.name}</strong>{" "}
                                <span className="text-muted">
                                  ({emp.employee_code || "-"})
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      {errors.employee_id && (
                        <div className="text-danger small mt-1">
                          {errors.employee_id[0]}
                        </div>
                      )}
                      {selectedEmployee && (
                        <div className="form-text text-success">
                          Selected: {selectedEmployee.name} (
                          {selectedEmployee.employee_code || "-"})
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Upload Payslip <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        id="payslip"
                        name="payslip"
                        accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.bmp,.svg"
                        className={`form-control ${
                          errors.payslip ? "is-invalid" : ""
                        }`}
                        onChange={handleFileChange}
                      />
                      {errors.payslip && (
                        <div className="invalid-feedback">{errors.payslip[0]}</div>
                      )}
                      {fileName && (
                        <div className="form-text">
                          <i className="bi bi-file-earmark me-1"></i>
                          Selected: <strong>{fileName}</strong>
                        </div>
                      )}
                      <div className="form-text">
                        Allowed: PDF, JPG, JPEG, PNG, GIF, WEBP, BMP, SVG | Max size: 500MB
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-end d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleReset}
                    >
                      Reset
                    </button>
                    <button type="button" className="btn btn-outline-danger" onClick={() => router.back()}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
