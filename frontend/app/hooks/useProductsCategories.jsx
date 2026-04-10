// app/hooks/useCategories.jsx
"use client";
import { useEffect, useState } from "react";

export default function useProductsCategories() {
  const [categoryData, setCategoryData] = useState([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/public/productsCategory`
        );
        const result = await res.json();
        setCategoryData(result.data || []);
       
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categoryData, loading };
}
