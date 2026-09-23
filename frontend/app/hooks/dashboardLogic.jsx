"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function useDashboardLogic() {
  const [dashboardData, setDashboardData] = useState({
    employee: 0,
    payslip: 0,
    user: 0,
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/dashbaord/getDashboardData`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        if (res.ok && result.data) {
          setDashboardData(result.data);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  return { dashboardData, loading };
}
