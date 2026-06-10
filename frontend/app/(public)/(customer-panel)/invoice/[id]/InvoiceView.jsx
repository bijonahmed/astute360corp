"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoiceView({ id }) {
  const { token } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      try {
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
          setInvoice(data.data.orderRow);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (!invoice) return <p>No invoice found.</p>;

  return (
    <div className="container mt-4">
      <h3>Invoice #{invoice.orderId}</h3>
      <p><strong>Status:</strong> {invoice.status_name}</p>
      <p><strong>Address:</strong> {invoice.address}</p>
      <p><strong>Phone:</strong> {invoice.shipping_phone}</p>
    </div>
  );
}
