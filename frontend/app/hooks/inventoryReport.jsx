"use client";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function useInventoryReport() {
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // fetchData function with useCallback so we can call it manually (refresh)
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/inventory/index`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      setInventoryData(result.data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // initial fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // return refresh function
  return { inventoryData, loading, refresh: fetchData };
}
