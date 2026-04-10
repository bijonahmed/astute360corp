"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OrderConfirmPage() {
  // Client-side code
  const searchParams = useSearchParams();
  const emails = searchParams.get("email");
  const password = searchParams.get("password");
  const order_id = searchParams.get("order_id");

  let userEmail = emails;
  let userPassword = password;

  if (typeof window !== "undefined") {
    userEmail = localStorage.getItem("userEmail") || userEmail;
    userPassword = localStorage.getItem("userPassword") || userPassword;
  }

  // Set dynamic page title
  useEffect(() => {
    document.title = "Order Success - Bir E-Commerce";
  }, []);

  return (
    <div className="order-confirm-page">
      {/* BREADCRUMB */}
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Order Confirmed</li>
          </ul>
        </div>
      </div>

      {/* CONFIRMATION SECTION */}
      <div className="container py-5">
        <div
          className="confirmation-box text-center"
          style={{
            background: "#fff",
            padding: "40px 30px",
            borderRadius: "10px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
            maxWidth: "650px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Order Confirmed!
          </h2>

          <p style={{ fontSize: "16px", color: "#555", marginBottom: "25px" }}>
            Thank you for your order! Our team is processing it and you will be
            notified once it's ready.
          </p>

          {/* USER LOGIN CREDENTIALS MESSAGE */}
          {(userEmail || userPassword) && (
            <p
              style={{
                fontSize: "16px",
                color: "#333",
                marginTop: "15px",
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                border: "1px solid #e2e2e2",
                textAlign: "left",
              }}
            >
              Your Order ID is : <strong>{order_id}</strong>
              <br />
              <br />
              <strong>Account Created Successfully!</strong> <br />
              You can now log in using your account details:
              <br />
              <br />
              <strong>Email:</strong> {userEmail} <br />
              <strong>Password:</strong> {userPassword}
              <br />
              <br />
              Please keep your login information safe.
            </p>
          )}

          <div style={{ marginTop: "25px" }}>
            <Link href="/shop">
              <button
                className="btn btn-primary"
                style={{
                  padding: "10px 25px",
                  fontSize: "16px",
                  borderRadius: "6px",
                  marginRight: "15px",
                }}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}