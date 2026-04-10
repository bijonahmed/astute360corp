"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function CustomerList() {
  const [customerData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE}/customer/getCustomerLists`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        setResponseData(result.data || []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { customerData, loading };
}
