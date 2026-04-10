"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import { customStyles } from "../../components/styles/customDataTable";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Purchase Order List";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [purchaseData, setPurchaseData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [transferItems, setTransferItems] = useState([]);

  const fetchSupplierData = async (selectedFilter = 1) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/supplier/index?selectedFilter=${selectedFilter}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
      setPurchaseData(result.data || []);
    } catch (err) {
      console.error("Fetch users failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    }
  };

  const fetchData = async (
    page = 1,
    pageSize = 10,
    searchQuery = "",
    supplierParam = ""
  ) => {
    setLoading(true);

    const supplierToUse = supplierParam || selectedSupplier;
    // console.log("Fetching data for supplier:", supplierToUse);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/purchase/index?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}&selectedSupplier=${supplierToUse}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
    } catch (err) {
      console.error("Fetch users failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferToProduct = async (id) => {
    if (!confirm("Are you sure you want to transfer?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/purchase/sendToTransferProduct/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Transfer failed");
        return;
      }
      //console.log(data.phsitory);
      setTransferItems(data.phsitory);
      // ✅ Open Bootstrap Modal
      const modalEl = document.getElementById("transferModal");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
      toast.success("Transfer successfully done.");
      fetchData();
      // Refresh table / remove deleted row from state
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/purchase/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed");
        return;
      }
      toast.success("Deleted successfully");
      fetchData();
      // Refresh table / remove deleted row from state
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchSupplierData();
    fetchData(page, perPage, search);
  }, [page, perPage, search]);

  const columns = [
    {
      name: "Invoice Number",
      selector: (row) => row.invNumber,
      sortable: true,
    },
    { name: "Order Date", selector: (row) => row.orderDate, sortable: true },
    {
      name: "Supplier Name",
      selector: (row) => row.supplier_name,
      sortable: true,
    },
    { name: "Grand Total", selector: (row) => row.grandTotal, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          {perms.includes("edit purchase order") ? (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => router.push(`/purchase/edit/${row.id}`)}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
          ) : null}

          {perms.includes("edit purchase order") ? (
            <button
              className="btn btn-sm btn-info"
              onClick={() => router.push(`/purchase/preview/${row.id}`)}
            >
              <i className="bi bi-zoom-in"></i> Preview
            </button>
          ) : null}

          <div className="flex items-center gap-2">
            {perms.includes("view purchase order") &&
              (row.transfer_status == 0 ? (
                <button
                  className="btn btn-sm btn btn-warning flex items-center gap-1"
                  onClick={() => handleTransferToProduct(row.id)}
                >
                  <i className="bi bi-arrow-repeat"></i> Transfer to product
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-success flex items-center gap-1"
                  disabled
                >
                  <i className="bi bi-check-circle"></i> Transfer complete
                </button>
              ))}
          </div>
          {perms.includes("delete purchase order") ? (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(row.id)}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,
      width: "500px",
    },
  ];

  const handlePageChange = (newPage) => setPage(newPage);
  const handlePerRowsChange = (newPerPage) => setPerPage(newPerPage);

  if (!perms.includes("view purchase order")) {
    router.replace("/dashboard");
    return false;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      {/*begin::App Content Header*/}
      <div className="app-content-header">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
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
                  {title}
                </li>
              </ol>
            </div>
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <Toaster position="top-right" />
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="card card-primary card-outline mb-4">
            {/* Header */}
            <div className="card-header">
              <div className="card-title w-100">
                <div className="row g-2 align-items-center">
                  {/* Column 1: Search input */}
                  <div className="col-12 col-md-4 col-lg-4">
                    <input
                      type="text"
                      placeholder="Search Invoice Number.."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-4 col-lg-4">
                    <select
                      className="form-select"
                      value={selectedSupplier}
                      onChange={(e) => {
                        setSelectedSupplier(e.target.value);
                      }}
                    >
                      <option value="">-- All Supplier --</option>
                      {purchaseData.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Status Filter */}

                  {/* Column 2: Fetch button */}
                  <div className="col-6 col-md-3 col-lg-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => fetchData()}
                    >
                      Filter
                    </button>
                  </div>

                  {/* Column 3: Add User button */}
                  <div className="col-6 col-md-3 col-lg-1 ms-auto">
                    {perms.includes("create supplier") ? (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => router.push(`/purchase/add/`)}
                      >
                        Add New
                      </button>
                    ) : null}{" "}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
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
                customStyles={customStyles}
              />
            </div>
          </div>

          {/*end::Body*/}
        </div>

        {/*end::Row*/}
      </div>
      {/*end::Container*/}
      {/* Modal */}
      {/* ✅ Modal Popup */}
      <div
        className="modal fade"
        id="transferModal"
        tabIndex="-1"
        aria-labelledby="transferModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content shadow-lg border-0">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="transferModalLabel">
                <i className="bi bi-box-seam me-2"></i>Transferred Product List
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {transferItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th className="text-center">Qty</th>
                        <th className="text-center">Price</th>
                        <th>Supplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transferItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td className="text-center">{item.stock_qty}</td>
                          <td className="text-center">Tk. {item.price}</td>
                          <td>{item.supplier_name || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-info-circle"></i> No items found.
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                <i className="bi bi-x-circle"></i> Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*end::App Content*/}
    </main>
  );
}
