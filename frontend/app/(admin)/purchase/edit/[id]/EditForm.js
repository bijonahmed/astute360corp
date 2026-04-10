// EditUserForm.jsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function EditUserForm({ id }) {
  const { token, permissions } = useAuth();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [invNumber, setInvNum] = useState("");
  const [remarks, setRemarks] = useState("");

  const [items, setItems] = useState([
    { description: "", sku: "", attribute: "", qty: 1, price: 0 },
  ]);

  // ➤ Add Item Row
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { description: "", sku: "", attribute: "", qty: 1, price: 0 },
    ]);
  };

  // ➤ Remove Row
  const removeRow = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // ➤ Handle Item Change
  const handleChange = (index, field, value) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index][field] =
        field === "qty" || field === "price" ? Number(value) : value;
      return updated;
    });
  };

  // ➤ Calculate line total
  const getLineTotal = (item) => (item.qty * item.price).toFixed(2);

  // ➤ Grand total
  const grandTotal = items
    .reduce((sum, item) => sum + item.qty * item.price, 0)
    .toFixed(2);

  // ------------------------------------------------------------------------------------
  // FIX: useCallback to avoid useEffect warning
  // ------------------------------------------------------------------------------------
  const fetchSupplierData = useCallback(async () => {
    if (!token) return;

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/supplier/index?selectedFilter=1`;

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed fetching supplier data.");
      }

      setPurchaseData(result.data || []);
    } catch (err) {
      console.error("Fetch suppliers failed:", err.message);
      toast.error(err.message);
    }
  }, [token]);

  // ------------------------------------------------------------------------------------
  // FIX: Add dependencies [id, token, fetchSupplierData]
  // ------------------------------------------------------------------------------------
  useEffect(() => {
    fetchSupplierData();
  }, [fetchSupplierData, id, token]);

  // ------------------------------------------------------------------------------------
  // FIX: Load purchase item details (added id, token)
  // ------------------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !token) return;

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

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const particular = data?.particularData || {};
        const history = data?.historyData || [];

        setItems(history);
        setSelectedSupplier(particular.supplier_id || "");
        setBillingAddress(particular.billingAddress || "");
        setShippingAddress(particular.shippingAddress || "");
        setOrderDate(particular.orderDate || "");
        setInvNum(particular.invNumber || "");
      } catch (error) {
        console.error("Error fetching purchase data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Page Title
  const pathname = usePathname();
  const title = "Supplier Edit";

  useEffect(() => {
    document.title = title;
  }, [title]);

  if (!permissions.includes("edit posts category")) {
    router.replace("/dashboard");
    return null;
  }

  const purchaseOrder = {
    id,
    invNumber,
    supplier: selectedSupplier,
    billingAddress,
    shippingAddress,
    orderDate,
    remarks,
    items,
    grandTotal,
  };

  // ------------------------------------------------------------------------------------
  // FORM SUBMIT
  // ------------------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/purchase/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(purchaseOrder),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Purchase Order updated successfully!");
        router.push("/purchase");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"));
        setErrors(data.errors);
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Network or server error!");
    }
  };

  // ------------------------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------------------------
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
                    className="text-blue-600"
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
              <Toaster position="top-right" />

              <div className="px-4 px-md-5 my-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    {/* FORM */}
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        {/* Invoice */}
                        <div className="col-md-3">
                          <label className="form-label">Invoice Number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={invNumber}
                            onChange={(e) => setInvNum(e.target.value)}
                          />
                        </div>

                        {/* Date */}
                        <div className="col-md-3">
                          <label className="form-label">Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>

                        {/* Supplier */}
                        <div className="col-md-6">
                          <label className="form-label">Supplier</label>
                          <select
                            className="form-select"
                            value={selectedSupplier}
                            onChange={(e) =>
                              setSelectedSupplier(e.target.value)
                            }
                          >
                            <option value="">-- Select Supplier --</option>
                            {purchaseData.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Billing */}
                        <div className="col-md-6">
                          <label className="form-label">Billing Address</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={billingAddress}
                            onChange={(e) =>
                              setBillingAddress(e.target.value)
                            }
                          />
                        </div>

                        {/* Shipping */}
                        <div className="col-md-6">
                          <label className="form-label">Shipping Address</label>
                          <textarea
                            className="form-control"
                            rows={2}
                            value={shippingAddress}
                            onChange={(e) =>
                              setShippingAddress(e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <hr />

                      {/* Items Table */}
                      <div className="d-flex justify-content-between mb-2">
                        <h5>Items</h5>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={addItem}
                        >
                          + Add Item
                        </button>
                      </div>

                      {loading ? (
                        <div className="d-flex justify-content-center py-5">
                          <div className="spinner-border text-primary" />
                        </div>
                      ) : null}

                      <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                          <thead className="table-light">
                            <tr>
                              <th>Description</th>
                              <th>SKU</th>
                              <th className="d-none">Attribute</th>
                              <th>Qty</th>
                              <th>Unit Price</th>
                              <th className="text-end">Line Total</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={item.description}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={item.sku}
                                    onChange={(e) =>
                                      handleChange(index, "sku", e.target.value)
                                    }
                                  />
                                </td>

                                <td className="d-none">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={item.attribute}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        "attribute",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    type="number"
                                    min="1"
                                    className="form-control text-end"
                                    value={item.qty}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        "qty",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td>
                                  <input
                                    type="number"
                                    className="form-control text-end"
                                    min="0"
                                    step="0.01"
                                    value={item.price}
                                    onChange={(e) =>
                                      handleChange(
                                        index,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>

                                <td className="text-end">
                                  {getLineTotal(item)}
                                </td>

                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeRow(index)}
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="row mt-3">
                        <div className="col-md-6">
                          <label className="form-label">Notes</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
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

                      <div className="d-flex justify-content-end gap-2 mt-3">
                        <button type="reset" className="btn btn-outline-secondary">
                          Reset
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Save Purchase Order
                        </button>
                      </div>
                    </form>
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
