"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useInventory from "../../hooks/inventoryReport";

export default function ProductPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];

  const title = "My Inventory";

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [inventoryhistory, setHistory] = useState([]);
  const [showList, setShowList] = useState(false);
  const { inventoryData, refresh, loading } = useInventory();
  const [quantity, setQuantity] = useState("");
  const [stockDate, setStockDate] = useState("");

  const [selectedProductId, setSelectedProductId] = useState("");

  // Set page title
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  useEffect(() => {
    const query = search || ""; // fallback to empty string
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const fetchData = async () => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/product/search?query=${search}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setResults(result || []);

      setShowList(true);
    };

    const delay = setTimeout(fetchData, 300); // debounce

    return () => clearTimeout(delay);
  }, [search]);

  const handleSelect = async (product) => {
    setSearch(product.name);
    setSelectedProductId(product.id);
    setResults([]);
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/inventory/searchproductId?query=${product.id}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    setHistory(result.data || []);
  };

  const handleSelectHistory = async (product) => {
    setSearch(product.name);
    setSelectedProductId(product.id);
    setResults([]);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/inventory/searchproductId?query=${product.product_id}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setHistory(result.data || []);

      // Show the modal after fetching data
      const modalEl = document.getElementById("historyModal");
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Failed to fetch inventory history");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProductId) {
      toast.error("Please select a product");
      return;
    }

    if (!quantity || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!stockDate) {
      toast.error("Please select a stock date");
      return;
    }

    const payload = {
      product_id: selectedProductId,
      quantity: Number(quantity),
      stock_date: stockDate,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/inventory/add-stock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Stock added successfully");
        refresh();
        // reset form
        setSearch("");
        setSelectedProductId(null);
        setQuantity("");
        setStockDate("");
        // Hide modal programmatically
        const modalEl = document.getElementById("addStockModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting stock");
    }
  };

  // Permission check
  if (!perms.includes("view posts")) {
    router.replace("/dashboard");
    return null;
  }
  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />
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
                  <div className="col-6 col-md-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      data-bs-toggle="modal"
                      data-bs-target="#addStockModal"
                    >
                      Add Stock
                    </button>
                  </div>
                  <div className="col-6 col-md-6">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => refresh()}
                    >
                      Fetch
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {loading && (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "200px" }}
              >
                <div
                  className="spinner-border text-primary"
                  role="status"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            <div className="card-body">
              <div className="row">
                {/* Left Column - Table */}
                <div className="col-12 col-lg-12 mb-3">
                  <div className="mb-3 d-none">
                    <label className="form-label">Search Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type product name..."
                      value={search || ""}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered align-middle">
                      <thead>
                        <tr>
                          <th style={{ backgroundColor: "#f6a5a5" }}>
                            Product ID
                          </th>
                          <th style={{ backgroundColor: "#f6d6a5" }}>
                            Product Name
                          </th>
                          <th
                            className="text-end"
                            style={{ backgroundColor: "#a5d6f6" }}
                          >
                            Total Stock In
                          </th>
                          <th
                            className="text-end"
                            style={{ backgroundColor: "#a5f6b0" }}
                          >
                            Total Stock Out
                          </th>
                          <th
                            className="text-end"
                            style={{ backgroundColor: "#f6f6a5" }}
                          >
                            Current Balance
                          </th>
                          <th
                            className="text-center"
                            style={{ backgroundColor: "#d6a5f6" }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(inventoryData) &&
                          inventoryData.map((item) => {
                            const balance = item?.current_balance ?? 0; // fallback if undefined
                            let balanceColor =
                              balance === 0
                                ? "#ffcccc"
                                : balance < 10
                                ? "#fff3cd"
                                : "#d4edda";

                            return (
                              <tr
                                key={item?.product_id || Math.random()}
                                style={{
                                  transition: "all 0.3s ease",
                                  backgroundColor: balanceColor,
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#cce5ff")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    balanceColor)
                                }
                              >
                                <td>{item?.product_id}</td>
                                <td>{item?.product_name}</td>
                                <td className="text-end">
                                  {item?.total_qty_in ?? 0}
                                </td>
                                <td className="text-end">
                                  {item?.total_qty_out ?? 0}
                                </td>
                                <td className="text-end">{balance}</td>
                                <td className="text-center">
                                  <button
                                    className="btn btn-sm btn-primary"
                                    style={{ transition: "transform 0.2s" }}
                                    onClick={() => handleSelectHistory(item)}
                                    onMouseEnter={(e) =>
                                      (e.currentTarget.style.transform =
                                        "scale(1.1)")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.currentTarget.style.transform =
                                        "scale(1)")
                                    }
                                  >
                                    View History
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="addStockModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          {/* EXTRA LARGE MODAL */}
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Stock</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <div className="row">
                {/* LEFT SIDE — FORM */}
                <div className="col-md-8">
                  <div className="row g-3 align-items-end">
                    {/* Product Name */}
                    <div className="col-md-4 position-relative">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        value={search || ""} // ensure controlled input
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-control"
                        placeholder="Search product..."
                      />

                      {/* Autocomplete Dropdown */}
                      {showList && results.length > 0 && (
                        <ul
                          className="list-group position-absolute w-100 shadow-sm"
                          style={{
                            zIndex: 2000,
                            maxHeight: "200px",
                            overflowY: "auto",
                            top: "100%", // dropdown below input
                            left: 0,
                          }}
                        >
                          {results.map((item) => (
                            <li
                              key={item.id}
                              className="list-group-item list-group-item-action"
                              onClick={() => handleSelect(item)}
                              style={{ cursor: "pointer" }}
                            >
                              {item.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Stock Quantity */}
                    <div className="col-md-4">
                      <label className="form-label">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={quantity || ""}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>

                    {/* Stock Date */}
                    <div className="col-md-4">
                      <label className="form-label">Stock Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={stockDate || ""}
                        onChange={(e) => setStockDate(e.target.value)}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-3">
                      <button
                        type="submit"
                        className="btn btn-success w-100"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE — INVENTORY HISTORY TABLE */}
                <div className="col-md-4">
                  <h6 className="mb-3 fw-bold">Inventory History</h6>

                  <div className="table-responsive border rounded">
                    <table className="table table-sm table-striped mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>SL</th>
                          <th>Stock Date</th>
                          <th>Stock IN</th>
                          <th>Entry By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventoryhistory.map((i, index) => (
                          <tr key={i.id || index}>
                            <td>{index + 1}</td>
                            <td>{i.stock_date}</td>
                            <td>{i.qty_in}</td>
                            <td>{i.entry_by}</td>
                          </tr>
                        ))}

                        {/* Map your inventory history here */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      <div
        className="modal fade"
        id="historyModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Inventory History</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Stock Date</th>
                    <th>Quantity In</th>
                    <th>Entry By</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryhistory.length > 0 ? (
                    inventoryhistory.map((h, index) => (
                      <tr key={h.id || index}>
                        <td>{index + 1}</td>
                        <td>{h.stock_date}</td>
                        <td>{h.qty_in}</td>
                        <td>{h.entry_by_name || h.entry_by}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No history found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
