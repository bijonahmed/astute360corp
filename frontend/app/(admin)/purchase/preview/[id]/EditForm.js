"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditUserForm({ id }) {
  const { token, permissions } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [supplier_name, setSupplier_name] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [invNumber, setInvNum] = useState("");
  const [remarks, setRemarks] = useState("");
  const [items, setItems] = useState([]);

  const printRef = useRef();

  // Calculate line total
  const getLineTotal = (item) => (item.qty * item.price).toFixed(2);

  // Grand total
  const grandTotal = items
    .reduce((sum, item) => sum + item.qty * item.price, 0)
    .toFixed(2);

  // ---------------------------------------------------------
  // ✅ FIXED: useCallback to stabilize fetchSupplierData
  // ---------------------------------------------------------
  const fetchSupplierData = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/supplier/index`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      setPurchaseData(result.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch suppliers.");
    }
  }, [token]);

  // ---------------------------------------------------------
  // ⭐ CORRECT useEffect: Only depends on fetchSupplierData
  // ---------------------------------------------------------
  useEffect(() => {
    fetchSupplierData();
  }, [fetchSupplierData]);

  // ---------------------------------------------------------
  // Fetch purchase order data
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/purchase/chkrow/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const particular = data?.particularData || {};
        const history = data?.historyData || [];

        setItems(history);
        setSelectedSupplier(particular.supplier_id || "");
        setBillingAddress(particular.billingAddress || "");
        setShippingAddress(particular.shippingAddress || "");
        setOrderDate(particular.orderDate || "");
        setInvNum(particular.invNumber || "");
        setRemarks(particular.remarks || "");
        setSupplier_name(particular.supplier_name || "");
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch purchase data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  // Print function
  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open("", "", "width=900,height=700");

    printWindow.document.write(`
      <html>
        <head>
          <title>Purchase Order - ${invNumber || "Preview"}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
          <style>
            body { padding: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #dee2e6; padding: 8px; }
            th { background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = () => window.close();
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const pathname = usePathname();
  const title = "Preview";

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  // Permission check
  if (!permissions.includes("edit posts category")) {
    router.replace("/dashboard");
    return null;
  }

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
                <li className="breadcrumb-item active">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                    className="text-blue-600 hover:underline"
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
            <div className="col-md-12">
              <div className="card card-primary card-outline mb-4">
                <Toaster position="top-right" />

                <div className="px-4 px-md-5 my-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      {/* Print Button */}
                      <div className="d-flex justify-content-end mb-3">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handlePrint}
                        >
                          🖨️ Print
                        </button>
                      </div>

                      <div ref={printRef}>
                        <form>
                          <div className="row g-3">
                            <div className="col-md-3">
                              <label className="form-label fw-bold">
                                Invoice Number:
                              </label>
                              <div className="form-control-plaintext">
                                {invNumber || "-"}
                              </div>
                            </div>

                            <div className="col-md-3">
                              <label className="form-label fw-bold">Date:</label>
                              <div className="form-control-plaintext">
                                {orderDate || "-"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Supplier:
                              </label>
                              <div className="form-control-plaintext">
                                {supplier_name || "-"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Billing Address:
                              </label>
                              <div className="border rounded p-2 bg-light">
                                {billingAddress || "-"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <label className="form-label fw-bold">
                                Shipping Address:
                              </label>
                              <div className="border rounded p-2 bg-light">
                                {shippingAddress || "-"}
                              </div>
                            </div>
                          </div>

                          <hr />

                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="mb-0">Items</h5>
                          </div>

                          {loading ? (
                            <div
                              className="d-flex justify-content-center align-items-center"
                              style={{ height: "200px" }}
                            >
                              <div
                                className="spinner-border text-primary"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="table-responsive">
                              <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                  <tr>
                                    <th>Description</th>
                                    <th className="text-center">SKU</th>
                                    <th className="text-end">Qty</th>
                                    <th className="text-end">Unit Price</th>
                                    <th className="text-end">Line Total</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {items.length > 0 ? (
                                    items.map((item, index) => (
                                      <tr key={index}>
                                        <td>{item.description || "-"}</td>
                                        <td className="text-center">
                                          {item.sku || "-"}
                                        </td>
                                        <td className="text-end">
                                          {item.qty || 0}
                                        </td>
                                        <td className="text-end">
                                          {item.price || 0}
                                        </td>
                                        <td className="text-end">
                                          {getLineTotal(item)}
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="5" className="text-center">
                                        No items available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="row mt-3">
                            <div className="col-md-6">
                              <label className="form-label fw-bold">Notes:</label>
                              <div className="border rounded p-2 bg-light">
                                {remarks || "-"}
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="card p-3">
                                <div className="d-flex justify-content-between">
                                  <div>Subtotal</div>
                                  <div>{grandTotal}</div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                  <strong>Grand Total</strong>
                                  <strong>{grandTotal}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
