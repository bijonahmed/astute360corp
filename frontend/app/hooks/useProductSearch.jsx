"use client";
import { useState, useEffect } from "react";

export default function useProductSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/public/search-products?q=${query}`,
          { signal }
        );
        const data = await res.json();
        if (data.success) setProducts(data.product);
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
  }, [query]);

  // ✅ Clear search input and products
  const clearSearch = () => {
    setQuery("");
    setProducts([]);
  };

  return { query, setQuery, products, loading, clearSearch };
}