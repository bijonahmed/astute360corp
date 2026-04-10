"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import CustomDataTable from "../../context/CustomDataTable";
import getCustomerList from "../../hooks/customerList";
import getOrderStatusList from "../../hooks/orderStatusList";

export default function ProductPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];

  const title = "Order List";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { customerData } = getCustomerList();
  const { ordersStsData } = getOrderStatusList();
  const [customerId, setCustomerid] = useState("");
  const [subcategoryId, setSubCategoryFilter] = useState("");
  const [subcategoryList, setSubCategories] = useState([]);
  const [total_records, setTotalRecords] = useState(0);
  const [placeholder, setPlaceholder] = useState("Search Order ID...");
  const handleChangeCustomer = async (e) => {
    const selectedId = e.target.value;
    setCustomerid(selectedId);
  };

  const fetchProducts = async (
    page = 1,
    perPageSize = 10,
    searchQuery = ""
  ) => {
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/orders/index?page=${page}&pageSize=${perPageSize}
                   &searchQuery=${encodedQuery}&customerId=${customerId}&status=${statusFilter}`;
      //  console.log("URL:" + url);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      setTotalRecords(json.total_records || 0);

      return {
        data: json.data || [],
        total: json.total_records || 0,
      };
    } catch (err) {
      console.error("Fetch products error:", err);
      return { data: [], total: 0 };
    }
  };

  // DataTable columns
  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
    },

    {
      name: "Order Date ",
      selector: (row) => row.order_date,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
    },

    {
      name: "Payment Method",
      selector: (row) => row.paymentMethod,
      sortable: true,
    },

    {
      name: "Grand Total",
      selector: (row) => row.grand_total,
      sortable: true,
    },

    {
      name: "Order Update By",
      selector: (row) => row.updateBy,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          style={{
            color: row.order_status === 1 ? "#b71c1c" : "#000",
            fontWeight: row.order_status === 1 ? "bold" : "normal",
          }}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          {perms.includes("edit order") && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => router.push(`/order/preview/${row.id}`)}
            >
              <i className="bi bi-zoom-in"></i> Invoice
            </button>
          )}
        </div>
      ),
      ignoreRowClick: true,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px", // font size for header cells
        fontWeight: "600",
      },
    },
    cells: {
      style: {
        fontSize: "16px", // font size for normal cells
      },
    },
  };
  // Permission check
  if (!perms.includes("view order")) {
    router.replace("/dashboard");
    return null;
  }
  // Set page title
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">
                {title}&nbsp;
                <span className="badge bg-primary">{total_records}</span>
              </h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="container-fluid">
          <div className="card card-primary card-outline mb-4">
            <div className="card-header">
              <div className="card-title w-100">
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-md-3 col-lg-3">
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-4 col-md-4 col-lg-3">
                    <select
                      className="form-select"
                      onChange={handleChangeCustomer}
                    >
                      <option value="">
                        ----------------------- All Customer
                        -----------------------
                      </option>
                      {customerData.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}-[{r.phone_number}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-4 col-md-1 col-lg-3">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">
                        ----------------------- Select Status
                        ------------------------
                      </option>
                      {ordersStsData.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6 col-md-2 col-lg-3">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => {
                        setSearch(search + " ");
                        setPlaceholder("");
                      }}
                    >
                      Fetch
                    </button>
                  </div>
                  <div className="col-6 col-md-3 col-lg-1 ms-auto d-none">
                    {perms.includes("create product") && (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => router.push(`#`)}
                      >
                        Add New
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <CustomDataTable
                columns={columns}
                fetchFunction={fetchProducts}
                searchValue={search}
                defaultPerPage={10}
                perPageOptions={[10, 25, 50]}
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
