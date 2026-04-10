"use client";

import { useEffect, useState } from "react";

export default function usePost(categoryId) {
  const [postData, setPostData] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE}/public/getsAllTraining`;

      const params = new URLSearchParams();

      if (categoryId) {
        params.append("category_id", categoryId);
      }

      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

      const res = await fetch(finalUrl);
      const result = await res.json();

      setPostData(result.data || []);
      setTrainingData(result.data || []);
    } catch (err) {
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return { postData, trainingData, loading };
}
