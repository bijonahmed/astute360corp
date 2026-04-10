"use client";
import { useEffect, useState } from "react";

export default function useProducts(categoryId) {
  const [postData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE}/public/getsPost`;

      const params = new URLSearchParams();

      if (categoryId) {
        params.append("category_id", categoryId);
      }
      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

      const res = await fetch(finalUrl);
      const result = await res.json();

      setResponseData(result.data || null);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return { postData, loading };
}