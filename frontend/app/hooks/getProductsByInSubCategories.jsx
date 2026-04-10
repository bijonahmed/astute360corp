"use client";
import { useEffect, useState } from "react";

export default function useProductsByInSubcategories(
  limit = 40,
  categoryId = null,
  subcategoryId = null,
  slug
) {
  const [products, setProducts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (currentOffset = 0, append = false) => {
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE}/public/getsAllproductsByInSubCategories?offset=${currentOffset}&limit=${limit}`;

      if (categoryId != null && categoryId !== "") {
        url += `&category_id=${categoryId}`;
      }

      if (subcategoryId != null && subcategoryId !== "") {
        url += `&subcategory_id=${subcategoryId}`;
      }

      if (slug != null && slug !== "") {
        url += `&slug=${slug}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      if (result.success && Array.isArray(result.product)) {
        if (result.product.length > 0) {
          setProducts((prev) =>
            append ? [...prev, ...result.product] : result.product
          );
          setHasMore(result.product.length === limit);
        } else {
          setProducts([]);
          setHasMore(false);
        }
      } else {
        setProducts([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchProducts(0, false);
  }, [categoryId, subcategoryId]);

  const loadMore = () => {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchProducts(newOffset, true);
  };

  return { products, loading, hasMore, loadMore };
}
