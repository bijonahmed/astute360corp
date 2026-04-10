// app/hooks/useCategories.jsx
"use client";
import { useEffect, useState } from "react";

export default function useCategoriesParent() {

  const [categoryParentData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/public/getCategoryParent`);
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

  return { categoryParentData, loading };
}
