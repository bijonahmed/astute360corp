// app/hooks/useCategories.jsx
"use client";
import { useEffect, useState } from "react";

export default function useCategories() {
  const [categoryData, setCategoryData] = useState([]);
  const [sliderData, setSlidersData] = useState([]);
  const [topBannerData, setTopBannerData] = useState("");
    const [promotionalStatus, setPromotionalStatus] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/public/getCategory`
        );
        const result = await res.json();
        setCategoryData(result.data || []);
        setTopBannerData(result.topBanner || []);
        setSlidersData(result.sliders || []);
         setPromotionalStatus(result.pro_status || "");
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categoryData, topBannerData, sliderData, promotionalStatus, loading };
}
