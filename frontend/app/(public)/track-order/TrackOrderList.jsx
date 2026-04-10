"use client";

import { useState } from "react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = async () => {
    if (!orderNumber) {
      setError("Please enter your order number");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/public/track-order/${orderNumber}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order not found");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "success";
      case "processing":
        return "warning";
      case "pending":
        return "secondary";
      default:
        return "info";
    }
  };

  return (
    <div className="ps-page--single py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">

            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold">Track Your Order</h2>
                  <p className="text-muted mb-0">
                    Enter your order number to check delivery status
                  </p>
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text bg-white">
                    <i className="bi bi-box-seam"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Order Number (e.g. ORD-10234)"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary w-100 btn-lg"
                  onClick={handleTrackOrder}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Tracking...
                    </>
                  ) : (
                    "Track Order"
                  )}
                </button>

                {error && (
                  <div className="alert alert-danger mt-4 text-center">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="alert alert-success mt-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">Order ID</span>
                      <span>{result.order_id}</span>
                         <span className="fw-semibold">Order Status</span>
                      <span>{result.order_status}</span>
                    </div>

                   
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
