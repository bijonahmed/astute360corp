"use client";
import { useState, useEffect } from "react";

export default function useSetting() {
  const [settingData, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/public/getSetting`,
          { signal }
        );
        const data = await res.json();

        if (data.success) setData(data.data);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => fetchProducts(), 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []); // <-- MUST HAVE dependency array

  return { settingData, loading };
}