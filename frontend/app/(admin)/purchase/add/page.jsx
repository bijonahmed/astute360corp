"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";

import Link from "next/link";

export default function PurchasePages() {
  const { token, permissions } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [invNumber, setInvNum] = useState("");
  const [remarks, setRemarks] = useState("");
  const title = "Purchase Order";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [items, setItems] = useState([
    { description: "", sku: "", attribute: "", qty: 1, price: 0 },
  ]);

  // Add new item row
  const addItem = () => {
    setItems([
      ...items,
      { description: "", sku: "", attribute: "", qty: 1, price: 0 },
    ]);
  };
  //  Remove
  const removeRow = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  //  Handle input change
  const handleChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "qty" || field === "price" ? Number(value) : value;
    setItems(newItems);
  };

  // 💰 Calculate line total
  const getLineTotal = (item) => {
    return (item.qty * item.price).toFixed(2);
  };

  // 💵 Calculate grand total
  const grandTotal = items
    .reduce((sum, item) => sum + item.qty * item.price, 0)
    .toFixed(2);

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

  useEffect(() => {
    fetchSupplierData();
  }, []);

  const purchaseOrder = {
    invNumber: invNumber,
    supplier: selectedSupplier,
    billingAddress: billingAddress,
    shippingAddress: shippingAddress,
    orderDate,
    remarks,
    items,
    grandTotal,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/purchase/create`,
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
        toast.success("Purchase Order added successfully ✅");
        router.push("/purchase");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        setErrors(data.errors);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error("Network or Server Error:", err);
      toast.error("Network or server error!");
    }
  };

  if (!permissions.includes("create purchase order")) {
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
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row g-4">
            {/*begin::Col*/}
            <div className="col-md-12">
              {/*begin::Quick Example*/}
              <div className="card card-primary card-outline mb-4">
                <Toaster position="top-right" />
                {/*begin::Form*/}

                <div className="px-4 px-md-5 my-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                          <div className="col-md-3">
                            <label className="form-label">Invoice Number</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Invoice Number"
                              value={invNumber}
                              onChange={(e) => setInvNum(e.target.value)}
                            />
                          </div>
                          <div className="col-md-3">
                            <label className="form-label">Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={orderDate}
                              onChange={(e) => setOrderDate(e.target.value)}
                            />
                          </div>
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
                              {purchaseData.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              Billing Address
                            </label>
                            <textarea
                              className="form-control"
                              rows={2}
                              value={billingAddress}
                              onChange={(e) =>
                                setBillingAddress(e.target.value)
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              Shipping Address
                            </label>
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
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0">Items</h5>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addItem}
                          >
                            + Add Item
                          </button>
                        </div>
                        <div className="table-responsive">
                          <table
                            className="table table-bordered align-middle"
                            id="itemTable"
                          >
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
                            <tbody id="itemBody">
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
                                      placeholder="Item description"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={item.sku}
                                      onChange={(e) =>
                                        handleChange(
                                          index,
                                          "sku",
                                          e.target.value
                                        )
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
                                      placeholder="Color/Size"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control text-end"
                                      min="1"
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
                                      step="0.01"
                                      min="0"
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
                              type="text"
                              className="form-control"
                              rows={3}
                              placeholder="Additional Notes."
                              value={remarks}
                              onChange={(e) => setRemarks(e.target.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <div className="card p-3">
                              <div className="d-flex justify-content-between">
                                <div>Subtotal</div>
                                <div id="subtotal">{grandTotal}</div>
                              </div>
                              <hr />
                              <div className="d-flex justify-content-between">
                                <strong>Grand Total</strong>
                                <strong id="grandTotal">{grandTotal}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <button
                            type="reset"
                            className="btn btn-outline-secondary"
                          >
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

                {/*end::Form*/}
              </div>
              {/*end::Quick Example*/}
            </div>
            {/*end::Col*/}
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::App Content*/}
    </main>
  );
}
