"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import useCategories from "../../../../hooks/useCategories";
import "../../../../components/styles/invoice.css";
import "../../../../components/styles/orderStatus.css";
import getOrderStatusList from "../../../../hooks/orderStatusList";
export default function EditProductForm({ id }) {
  const { token, permissions } = useAuth();
  const { categoryData } = useCategories();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [invoice, setInvoice] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateBy, setUpdateBy] = useState("");
  const { ordersStsData } = getOrderStatusList();
  const [showModal, setShowModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [pathaoOrderStatus, setPathaoOrderStatus] = useState(null);
  const [areaSearch, setAreaSearch] = useState("");
  const [orderResponseData, setOrderResponseData] = useState(null);
  const filteredCityList = cityList.filter((city) =>
    city.city_name.toLowerCase().includes(citySearch.toLowerCase())
  );
  const handlePrint = () => {
    const printContents = document.getElementById("printArea").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  const [invoiceData, setInvoiceData] = useState({
    delivery_charge: "",
  });

  const fetchPathoResponse = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deliveryAssign/checkPathaoResponseOrder?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOrderResponseData(data.orderResonse);
        setPathaoOrderStatus(data.orderResonse.order_status);
        console.log(
          "Patho Respose Order status:" + data.orderResonse.order_status
        );
      } else {
        console.error("Auth error:", data.message);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoice = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/customer/getOrderCustomer?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        //console.log("Invoice updateBy:", data.data.updateBy);
        setInvoice(data.data.orderRow);
        setUpdateStatus(data.data.orderRow.order_status);
        setUpdateBy(data.data.updateBy);
        setOrderHistory(data.data.orderHistory);
      } else {
        console.error("Auth error:", data.message);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Set into state
  const title = `Order ID: [${id}]`;
  useEffect(() => {
    document.title = title;
  }, [title]);
  useEffect(() => {
    fetchInvoice();
    fetchPathoResponse();
  }, [id]);
  // Submit handler
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!updateStatus) {
      toast.error("Please select a status!");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/orders/orderUpdate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // <-- REQUIRED
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: invoice.id,
            status: updateStatus,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(
          `Status updated successfully!\nOrder ID: ${invoice.orderId}`
        );
        router.push("/order");
      } else {
        toast.error("Failed to update!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const checkFirstStore = async () => {
    try {
      setLoading(true); // start loading
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deliveryAssign/checkInitialized`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify([]),
        }
      );
      const data = await res.json();
      setShowModal(true);
      setStoreList(data.responseData.store.data || []);
      setCityList(data.responseData.city.data || []);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false); // stop loading in both success/error
    }
  };
  const handleCityClick = async (cityId) => {
    setSelectedCity(cityId); // set selected city
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deliveryAssign/checkZone`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ cityId: cityId }), // send selected city_id
        }
      );
      const data = await res.json();
      if (data.success) {
        setZoneList(data.responseData.zone.data || []);
      } else {
        toast.error("Failed to fetch zone data");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const handleZoneClick = async (zone_id) => {
    setSelectedZoneId(zone_id); // set selected city
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deliveryAssign/checkZoneWiseArea`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ zone_id: zone_id }), // send selected city_id
        }
      );
      const data = await res.json();
      if (data.success) {
        setAreaList(data.responseData.area.data || []);
      } else {
        toast.error("Failed to fetch zone data");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };
  const sendToPathaoMerchant = async () => {
    if (
      !selectedStoreId ||
      !selectedCity ||
      !selectedStoreId ||
      !selectedAreaId
    ) {
      toast.error("Please select Store, City, and Area before sending.");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        id: invoice.id,
        status: updateStatus,
        store_id: selectedStoreId,
        city_id: selectedCity,
        zone_id: selectedZoneId,
        area_id: selectedAreaId,
        delivery_charge: Number(invoiceData.delivery_charge),
      };
      // Send request
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/deliveryAssign/sendMerchant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Successfully sent to Pathao Merchant!");
        setCityList([]);
        setZoneList([]);
        setAreaList([]);
        setOrderResponseData(data.orderResonse);
        setShowModal(false);
        setSelectedStoreId(null);
        setSelectedCity(null);
        setSelectedAreaId(null);
        router.replace("/order");
       // window.location.reload();
      } else {
        toast.error(data.message || "Failed to send data.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending to Pathao.");
    } finally {
      setLoading(false);
    }
  };
  const handleSendtoDelivery = async (e) => {
    e.preventDefault();
    if (!updateStatus) {
      toast.error("Please select a status!");
      return;
    }
    checkFirstStore();
    return false;
  };
  if (!permissions.includes("view order")) {
    router.replace("/dashboard");
    return null;
  }
  const toUpperSafe = (text) => (text ? text.toUpperCase() : "");
  const totalAmount = orderHistory.reduce((sum, order) => {
    return sum + order.qty * order.price;
  }, 0);

  useEffect(() => {
    setInvoiceData({
      delivery_charge: invoice.devliery_charge || "",
    });
  }, [invoice]);

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-sm-8">
            <h3 className="mb-0">Order ID:{invoice.orderId}&nbsp;</h3>
          </div>
          <div className="col-sm-3">
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
        <div className="card card-primary card-outline mb-4">
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : null}
          <div className="mt-5 p-4" id="printArea">
            <div className="row">
              <div className="col-8">
                {/* start */}
                <div>
                  <h1>INVOICE</h1>
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Order ID:</strong> {invoice.orderId}
                        </td>
                        <td>
                          <strong>Date:&nbsp;</strong>
                          {invoice.order_date}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Shipping Address:</strong> {invoice.address}
                        </td>
                        <td>
                          <strong>Shipping Phone:</strong>{" "}
                          {invoice.shipping_phone}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Status:</strong> {invoice.status_name}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3">
                          <strong>Payment Method:</strong>&nbsp;
                          {toUpperSafe(invoice?.paymentMethod)}
                          {/* If Bkash then show details */}
                        </td>
                      </tr>
                      {/* SHOW ONLY IF PAYMENT METHOD = BKASH */}
                      {invoice.paymentMethod === "bkash" && (
                        <tr>
                          <td>
                            <strong>Bkash Number:</strong>{" "}
                            {invoice.bkash_number}
                          </td>
                          <td>
                            <strong>Transaction ID:</strong>{" "}
                            {invoice?.transaction_id ?? ""}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <hr />
                  <br />
                  {/* <pre>{JSON.stringify(orderHistory,null,2)}</pre> */}
                  <table className="product-table">
                    <tbody>
                      <tr>
                        <th>Product Name</th>
                        <th className="text-center">Qty</th>
                        <th className="text-center">Unit Price</th>
                        <th className="text-center">Total</th>
                      </tr>
                      {orderHistory.map((order) => (
                        <tr key={order.id}>
                          <td>
                            {order.product_name || ""} &nbsp;
                            {order.variation_value && (
                              <b>({order.variation_value})</b>
                            )}
                          </td>
                          <td className="text-center">{order.qty || ""}</td>
                          <td className="text-center">
                            Tk. {order.price || ""}
                          </td>
                          <td className="text-center">
                            Tk. {order.qty * order.price}{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="total-section">
                    <p>
                      <strong>Subtotal:</strong> Tk. {totalAmount}
                    </p>
                    <p>
                      <strong>Shipping:</strong> Tk. {invoice.devliery_charge}
                    </p>
                    <p>
                      <strong>Grand Total:</strong>{" "}
                      <strong>
                        Tk.{" "}
                        {(
                          parseFloat(totalAmount || 0) +
                          parseFloat(invoice.devliery_charge || 0)
                        ).toFixed(2)}
                      </strong>
                    </p>
                  </div>
                  <div className="d-flex justify-content-end">
                    <button className="print-btn" onClick={handlePrint}>
                      Print Invoice
                    </button>
                  </div>
                </div>
                {/* END */}
              </div>
              <div className="col-4">
                {/* Transfer Card */}
                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-body text-center p-4">
                    <h5 className="mb-3 fw-bold">Delivery Action</h5>

                    {pathaoOrderStatus ? (
                      <>
                        <button className="btn btn-danger w-100 py-3 rounded-4 fw-semibold d-flex justify-content-center align-items-center gap-2">
                          <i className="bi bi-truck"></i>
                          Already Sent to Pathao
                        </button>
                      </>
                    ) : (
                      <>
                        <form onSubmit={handleSendtoDelivery}>
                          <button
                            className="btn btn-primary w-100 py-3 rounded-4 fw-semibold d-flex justify-content-center align-items-center gap-2"
                            type="submit"
                          >
                            <i className="bi bi-truck"></i>
                            Transfer to Pathao
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
                {/* Status Card */}
                <div className="card shadow-sm border-0 rounded-4 mt-4">
                  <div className="card-body text-center p-4">
                    <h5 className="mb-4 fw-bold">Update Status</h5>
                    <form
                      onSubmit={handleStatusUpdate}
                      className="d-flex justify-content-center"
                    >
                      <select
                        className="form-select form-select-lg rounded-pill status-select px-4 py-2 shadow-sm"
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                      >
                        <option value="">Select Status</option>
                        {ordersStsData.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="btn btn-warning btn-lg rounded-pill px-4 fw-semibold shadow-sm"
                      >
                        Update
                      </button>
                    </form>
                    {orderResponseData && (
                      <div className="card mt-3">
                        <div className="card-body">
                          <h5 className="fw-bold mb-3">
                            Pathao Order Response
                          </h5>
                          <table className="table table-bordered table-sm">
                            <tbody>
                              <tr>
                                <th>Consignment ID</th>
                                <td>{orderResponseData.consignment_id}</td>
                              </tr>
                              <tr>
                                <th>Merchant Order ID</th>
                                <td>{orderResponseData.merchant_order_id}</td>
                              </tr>
                              <tr>
                                <th>Order Status</th>
                                <td>{orderResponseData.order_status}</td>
                              </tr>
                              <tr>
                                <th>Delivery Fee</th>
                                <td>{orderResponseData.delivery_fee}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {invoice.orderUpdateDate && (
            <p className="bg-warning bg-opacity-25 p-2 rounded">
              Last Update Date: {invoice.orderUpdateDate}, Last Update By:&nbsp;
              {updateBy}
            </p>
          )}
        </div>
        {showModal && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div
              className="modal-dialog modal-xl modal-fullscreen-lg-down"
              style={{ maxWidth: "95%" }}
            >
              {" "}
              {/* extra large */}
              <div className="modal-content rounded-4 border-0 shadow">
                <div className="modal-header">
                  <h5 className="modal-title">API Response Data</h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Summary */}
                  <div className="mb-4">
                    <strong>Reciept Address:</strong> {invoice.address}
                    <strong>Selected Store:</strong> {selectedStoreId},
                    <strong>Selected City:</strong> {selectedCity} ,
                    <strong>Selected Zone:</strong> {selectedZoneId},
                    <strong>Selected Area:</strong> {selectedAreaId}
                  </div>
                  <div className="d-flex gap-3 flex-wrap">
                    {/* Store List */}
                    <div className="card shadow-sm mb-3 flex-fill">
                      <div className="card-body">
                        <h5 className="fw-bold mb-3">Store List</h5>
                        <div
                          className="table-responsive"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          <table className="table table-hover table-striped align-middle text-center mb-0 text-nowrap">
                            <thead className="table-primary">
                              <tr>
                                <th>#</th>
                                <th>Store Name</th>
                                <th>Address</th>
                              </tr>
                            </thead>
                            <tbody>
                              {storeList.length > 0 ? (
                                storeList.map((item, index) => (
                                  <tr
                                    key={item.store_id || index}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      setSelectedStoreId(item.store_id)
                                    }
                                    className={
                                      selectedStoreId === item.store_id
                                        ? "table-primary"
                                        : ""
                                    }
                                  >
                                    <td>{index + 1}</td>
                                    <td className="text-start">
                                      {item.store_name}
                                    </td>
                                    <td className="text-start">
                                      {item.store_address}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3" className="text-center">
                                    No Data Found
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {/* City List */}
                    <div className="card shadow-sm mb-3 flex-fill">
                      <div className="card-body">
                        <div className="mb-3">
                          <label
                            htmlFor="citySelect"
                            className="form-label fw-bold"
                          >
                            Select City
                          </label>
                          <select
                            id="citySelect"
                            className="form-select"
                            value={selectedCity || ""}
                            onChange={(e) => handleCityClick(e.target.value)}
                          >
                            <option value="" disabled>
                              -- Select a city --
                            </option>

                            {filteredCityList.length > 0 ? (
                              filteredCityList.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                  {city.city_name} (ID: {city.city_id})
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No cities found
                              </option>
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Area List */}
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-6">
                          <h5 className="fw-bold mb-3">Zone List</h5>
                          {/* Search Input */}
                          <div className="mb-3">
                            <label
                              htmlFor="zoneSelect"
                              className="form-label fw-bold"
                            >
                              Select Zone
                            </label>
                            <select
                              id="zoneSelect"
                              className="form-select"
                              value={selectedZoneId || ""}
                              onChange={(e) => handleZoneClick(e.target.value)}
                            >
                              <option value="" disabled>
                                -- Select a zone --
                              </option>

                              {zoneList.length > 0 ? (
                                zoneList.map((zone) => (
                                  <option
                                    key={zone.zone_id}
                                    value={zone.zone_id}
                                  >
                                    {zone.zone_name} (ID: {zone.zone_id})
                                  </option>
                                ))
                              ) : (
                                <option value="" disabled>
                                  No zones available
                                </option>
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="col-6">
                          {/* Area List */}
                          <div className="card shadow-sm mb-3">
                            <div className="card-body">
                              <h5 className="fw-bold mb-3">Area List</h5>
                              {/* Search Input */}
                              <div className="row">
                                <div className="col-12">
                                  {/* Optional: Search Input */}
                                  <div className="mb-3">
                                    <input
                                      type="text"
                                      className="form-control w-auto"
                                      placeholder="Search Area..."
                                      value={areaSearch}
                                      onChange={(e) =>
                                        setAreaSearch(e.target.value)
                                      }
                                    />
                                  </div>

                                  {/* Dropdown */}
                                  <select
                                    className="form-select"
                                    value={selectedAreaId || ""}
                                    onChange={(e) =>
                                      setSelectedAreaId(e.target.value)
                                    }
                                  >
                                    <option value="" disabled>
                                      -- Select Area --
                                    </option>

                                    {areaList.filter((area) =>
                                      area.area_name
                                        .toLowerCase()
                                        .includes(areaSearch.toLowerCase())
                                    ).length > 0 ? (
                                      areaList
                                        .filter((area) =>
                                          area.area_name
                                            .toLowerCase()
                                            .includes(areaSearch.toLowerCase())
                                        )
                                        .map((area) => (
                                          <option
                                            key={area.area_id}
                                            value={area.area_id}
                                          >
                                            {area.area_name} (ID: {area.area_id}
                                            ) | Home Delivery:{" "}
                                            {area.home_delivery_available
                                              ? "Yes"
                                              : "No"}{" "}
                                            | Pickup:{" "}
                                            {area.pickup_available
                                              ? "Yes"
                                              : "No"}
                                          </option>
                                        ))
                                    ) : (
                                      <option value="" disabled>
                                        No areas found
                                      </option>
                                    )}
                                  </select>
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="form-label">
                                  Delivery Charge{" "}
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="delivery_charge"
                                  defaultValue={invoice.devliery_charge} // FIX
                                  onBlur={(e) =>
                                    setInvoiceData((prev) => ({
                                      ...prev,
                                      delivery_charge: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary btn-lg"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="btn btn-success btn-lg"
                    onClick={sendToPathaoMerchant} // your handler function
                    disabled={
                      !selectedStoreId || !selectedCity || !selectedAreaId
                    } // disable if selection incomplete
                  >
                    Send to Pathao Merchant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
