"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // adjust path

export default function dashboardLogic() {
  const [dashbaordData, setDashboardData] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, permissions } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/dashbaord/getDashboardData`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        setDashboardData(result.data || []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { dashbaordData, loading };
}
