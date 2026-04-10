"use client";

import React, { useState } from "react";
import useCategories from "../../hooks/useProductsCategories";
import { useRouter } from "next/navigation";
import "../styles/loader.css";
import Link from "next/link";

export default function ProductCategories() {
  const { categoryData, loading } = useCategories();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  const [categoryProducts, setCategoryProducts] = useState({});
  const [responseInSubcategory, setInSubcategory] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState({});
  const [subCatImage, setSubCatImage] = useState({});
  const [selectedChildId, setSelectedChildId] = useState({});
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const [openChildId, setOpenChildId] = useState(null);

  const handleParentClick = (parent, child) => {
    if (!child || !child.id) return;
    setOpenChildId((prev) => (prev === child.id ? null : child.id));

    setSelectedParentId(child.id);
    setSelectedItemId(null);

    fetchProducts(parent.id, child.slug);
  };
  /*
  const handleCardClick = async (item, parentId) => {
     router.push(`/shop-product-categories/${item.slug}`);
  };
  */

  const handleCardClick = async (item, parentId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setSelectedItemId(item.id);

      const url = `${process.env.NEXT_PUBLIC_API_BASE}/public/inSubcategoryFilter?slug=${item.slug}`;
      const res = await fetch(url);
      const result = await res.json();

      console.log("API result:", result);

      if (result.success && Array.isArray(result.product)) {
        setCategoryProducts((prev) => ({
          ...prev,
          [parentId]: result.product,
        }));

        // setInSubcategory(result.checkinSubCategories || []);
        // setSelectedChildId((prev) => ({
        //   ...prev,
        //   [parentId]: result.childId,
        // }));
      } else {
        setCategoryProducts((prev) => ({ ...prev, [parentId]: [] }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async (parentId, slug, childId, bannerImage) => {
    try {
      setCategoryLoading((prev) => ({ ...prev, [parentId]: true }));
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/public/categoryFilter?slug=${slug}`;
      const res = await fetch(url);
      const result = await res.json();

      if (result.success && Array.isArray(result.product)) {
        setCategoryProducts((prev) => ({
          ...prev,
          [parentId]: result.product,
        }));
        setInSubcategory(result.checkinSubCategories || []);
        setSubCatImage((prev) => ({
          ...prev,
          [parentId]: {
            childId: result.childId,
            image: result.subcategoryImage || bannerImage || "",
          },
        }));
        setSelectedChildId((prev) => ({
          ...prev,
          [parentId]: result.childId,
        }));
      } else {
        setCategoryProducts((prev) => ({ ...prev, [parentId]: [] }));
        setInSubcategory([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setCategoryProducts((prev) => ({ ...prev, [parentId]: [] }));
    } finally {
      setCategoryLoading((prev) => ({ ...prev, [parentId]: false }));
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {categoryData.map((parent) => {
        const products = categoryProducts[parent.id] || parent.products;
        const isLoading = categoryLoading[parent.id];

        return (
          <div
            key={parent.id}
            className="ps-block--products-of-category mb-10 relative"
          >
            {isLoading && (
              <div className="fullscreen-loader-overlay">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="loader-text">Loading... Please wait</p>
              </div>
            )}

            <div className="ps-block__categories">
              <h3>
                <Link href={`/product-categories/${parent.slug}`}>
                  {parent.name}
                </Link>
              </h3>

              <ul
                style={{
                  marginBottom: "50px",
                  listStyle: "none",
                  paddingLeft: 0,
                }}
              >
                {parent.children && parent.children.length > 0 ? (
                  parent.children.map((child) => {
                    if (!child) return null;

                    const filteredSubcategories = (
                      responseInSubcategory || []
                    ).filter((item) => item.parentId === child.id);

                    return (
                      <li
                        key={`${parent.id}-${child.id}`}
                        style={{
                          borderBottom: "1px solid #ccc",
                          padding: "5px 0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: child.insub_category
                              ? "pointer"
                              : "default",
                            backgroundColor:
                              openChildId === child.id
                                ? "#fff3cd"
                                : "transparent",
                            fontWeight:
                              openChildId === child.id ? "600" : "normal",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            transition: "background-color 0.2s",
                          }}
                          onClick={() => handleParentClick(parent, child)}
                        >
                          <span>{child.name}</span>

                          {child.insub_category && (
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                handleParentClick(parent, child);
                              }}
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              style={{
                                width: "16px",
                                height: "16px",
                                marginLeft: "5px",
                                transform:
                                  openChildId === child.id
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                                transition: "transform 0.3s ease",
                                cursor: "pointer",
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </div>

                        {child.insub_category && openChildId === child.id && (
                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              marginTop: "5px",
                            }}
                          >
                            {(Array.isArray(responseInSubcategory)
                              ? responseInSubcategory
                              : []
                            ).map((item) => (
                              <li
                                key={item.id}
                                style={{
                                  padding: "6px 10px",
                                  cursor: "pointer",
                                  borderBottom: "1px solid #eee",
                                  backgroundColor:
                                    selectedItemId === item.id
                                      ? "#fff3cd"
                                      : "transparent",
                                  fontWeight:
                                    selectedItemId === item.id
                                      ? "600"
                                      : "normal",
                                  transition: "background-color 0.2s",
                                }}
                                onClick={(e) =>
                                  handleCardClick(item, parent.id, e)
                                }
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li
                    key={`no-subcategories-${parent.id}`}
                    style={{ padding: "5px 0", color: "#999" }}
                  >
                    No subcategories
                  </li>
                )}
              </ul>

              <Link
                href={`/product-categories/${parent.slug}`}
                style={{
                  display: "inline-block",
                  marginTop: "20px",
                  padding: "10px 20px",
                  borderRadius: "25px",
                  background: "linear-gradient(135deg, #facc15, #f59e0b)",
                  color: "#1f2937",
                  fontWeight: "700",
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(245,158,11,0.4)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 25px rgba(245,158,11,0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(245,158,11,0.4)";
                }}
              >
                View All →
              </Link>
            </div>

            <div className="ps-block__slider">
              <img
                loading="lazy"
                src={
                  subCatImage[parent.id] &&
                  selectedChildId[parent.id] === subCatImage[parent.id]?.childId
                    ? subCatImage[parent.id].image || parent.banner_image
                    : parent.banner_image ||
                      "/frontend_theme/img/slider/home-3/blank_category.png"
                }
                alt={parent.name}
              />
            </div>

            {products && products.length > 0 && (
              <div className="ps-block__product-box">
                {products.map((product) => (
                  <div
                    key={`${parent.id}-${product.id}`}
                    className="ps-product ps-product--simple"
                    style={{ textOverflow: "ellipsis", cursor: "pointer" }}
                    title={product.fname}
                  >
                    <div
                      className={`image-wrapper ps-product__thumbnail ${loaded ? "loaded" : ""}`}
                    >
                      <Link href={`/product-details/${product.slug}`}>
                        <img
                          loading="lazy"
                          src={
                            product.thumbnail ||
                            "/frontend_theme/img/products/clothing/1.jpg"
                          }
                          onLoad={() => setLoaded(true)}
                          alt={product.name}
                        />
                      </Link>
                    </div>
                    <div className="ps-product__container">
                      <div className="ps-product__content">
                        <p className="ps-product__title text-center">
                          {product.name}
                        </p>
                        <p className="ps-product__price sale">
                          Tk.{product.discount_price ?? "0"}{" "}
                          <del>Tk.{product.price ?? "0"}</del>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <style>
        {`
.collapse.show {
pointer-events: auto !important;
}
`}
      </style>
    </>
  );
}
