"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useCategories from "../../../hooks/useCategories";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Restore List";

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [statusFilter, setStatusFilter] = useState(0);

  // 🔹 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { categoryData } = useCategories();

  const fetchRestoreProCategory = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/product-category/restoreCategorys`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}`);
      setData(result.data || []);
    } catch (err) {
      console.error("Fetch failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestoreProCategory();
  }, []);

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setStatusFilter(item.status);
    setShowModal(true);
  };

  const updateStatus = async (id, status) => {
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/update-status/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}`);
      toast.success("Status updated successfully!");

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: statusFilter } : item,
        ),
      );
    } catch (err) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  if (!perms.includes("view product category")) {
    router.replace("/dashboard");
    return null;
  }

  // 🔹 Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

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
                <li className="breadcrumb-item active">{title}</li>
                <li className="breadcrumb-item">
                  <Link href="/product-categories-manage">
                    Back to Category
                  </Link>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="container-fluid">
          <div className="d-flex justify-content-between mb-2">
            <div>
              <label>Rows per page: </label>
              <select
                className="form-select d-inline-block w-auto ms-2"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1); // reset to first page
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>

            <div>
              <button
                className="btn btn-secondary btn-sm me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  background: "#fff",
                }}
              >
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.status === 1 ? "bg-primary" : "bg-danger"
                        }`}
                      >
                        {item.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔹 Modal */}
      {showModal && currentItem && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Status: {currentItem.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <label>Status</label>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(parseInt(e.target.value))}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    await updateStatus(currentItem.id, statusFilter);
                    setShowModal(false);
                  }}
                  disabled={saving}
                >
                  {saving && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
