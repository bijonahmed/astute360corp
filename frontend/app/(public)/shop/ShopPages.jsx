"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Slider from "../../components/frontend/SliderShop";
import useProducts from "../../hooks/getProducts";
import "../../components/styles/darknessLoader.css";
import "../../components/styles/beforeLoading.css";
import "../../components/styles/loadmore.css";
import "../../components/styles/shopCategoryResponsive.css";

import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
  title: "shop - Bir E-Commerce",
  description: "Securely complete your order and payment on Bir E-Commerce.",
  keywords: [
    "checkout",
    "payment",
    "online shopping",
    "bir e-commerce",
    "order summary",
    "secure checkout",
  ],
  openGraph: {
    title: "shop - Bir E-Commerce",
    description: "Securely complete your order and payment on Bir E-Commerce.",
    url: `${baseUrl}/shop`,
    siteName: "Bir E-Commerce",
    images: [
      {
        url: "/og-image-checkout.jpg",
        width: 1200,
        height: 630,
        alt: "Checkout Page Preview - Bir E-Commerce",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/shop`,
  },
};

export default function ShopPage() {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("grid"); // default view
  const { addToCart, addToWishlist, wishlist, cart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [qty, setQty] = useState(1);
  const [ChildCategorys, setChildCategory] = useState([]);
  const [inChildCategory, setInChildCategory] = useState([]);
  const [inSubProducts, setInSubProducts] = useState([]);
  const [inSelectedSubcategory, setInSelectedSubcategory] = useState(null);
  const shopContainerRef = useRef(null);
  const lastScrollY = useRef(0);

  const {
    products: hookProducts,
    getCategories,
    loading,
    hasMore,
    loadMore,
  } = useProducts(40, selectedCategory, selectedSubcategory);

  // Conditional products: hookProducts or inSubProducts
  const displayedProducts =
    inSubProducts && inSubProducts.length > 0
      ? inSubProducts
      : hookProducts && hookProducts.length > 0
        ? hookProducts
        : [];
  // console.log("displayedProducts:" + displayedProducts);
  // Prevent default empty links
  useEffect(() => {
    const root = shopContainerRef.current ?? document;
    const clickHandler = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href === "#") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    root.addEventListener("click", clickHandler);
    return () => root.removeEventListener("click", clickHandler);
  }, []);

  useEffect(() => {}, [hookProducts, inSubProducts]);
  // Restore scroll after loading more products
  useEffect(() => {
    if (!loading && lastScrollY.current) {
      window.scrollTo({
        top: lastScrollY.current,
        behavior: "auto",
      });
      lastScrollY.current = 0;
    }
  }, [loading]);

  const handleSelect = (eOrCategory, maybeCategory = null) => {
    let e = null;
    let category = null;

    if (maybeCategory) {
      e = eOrCategory;
      category = maybeCategory;
    } else {
      category = eOrCategory;
    }
    //console.log("Sending id:", category.id);

    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    lastScrollY.current = window.scrollY;

    if (category.parent_id && category.parent_id !== 0) {
      setSelectedCategory(category.parent_id);
      setSelectedSubcategory(category.id);

      if (!ChildCategorys.some((c) => c.id === category.id)) {
        fetchSubcategoryies(category.id);
      }
    } else {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null);

      if (!ChildCategorys.some((c) => c.parent_id === category.id)) {
        fetchSubcategoryies(category.id);
        fetchInSubProducts(category.id);
      }
    }
  };

  const handleSelectSubCat = (id) => {
    fetchInSubProducts(id);
  };

  const fetchInSubProducts = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/public/getInSubProducts?id=${id}`;

      const res = await fetch(url);
      const result = await res.json();
      console.log("Result" + result.product);

      if (result?.success) {
        setInSubProducts(result.product);
      } else {
        setInSubProducts([]);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchSubcategoryies = async (parent_id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/public/getChildDataOnly?parent_id=${parent_id}`;

      const res = await fetch(url);
      const result = await res.json();

      if (result?.success) {
        setChildCategory(result.childData);
      } else {
        setChildCategory([]);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchinSubcategoryies = async (parent_child_id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/public/getChildChildDataOnly?parent_child_id=${parent_child_id}`;

      const res = await fetch(url);
      const result = await res.json();

      if (result?.success) {
        setInChildCategory(result.inChildData);
      } else {
        setInChildCategory([]);
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleAddToCart = (productRow) => {
    const isDuplicate = cart.some((item) => item.id === productRow.id);

    if (isDuplicate) {
      Swal.fire({
        icon: "warning",
        title: "<span style='font-size:18px;'>Already in Cart</span>",
        html: "<span style='font-size:16px;'>This product is already in your cart.</span>",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    addToCart(productRow, qty, []);
    Swal.fire({
      icon: "success",
      title: "<span style='font-size:18px;'>Added to Cart</span>",
      html: `<span style='font-size:16px;'>${productRow.name} has been added to your cart.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleAddToWishList = (productRow) => {
    const isDuplicate = wishlist.some((item) => item.id === productRow.id);

    if (isDuplicate) {
      Swal.fire({
        icon: "warning",
        title: "<span style='font-size:18px;'>Already in Wishlist</span>",
        html: "<span style='font-size:16px;'>This product is already in your wishlist.</span>",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    addToWishlist(productRow);
    Swal.fire({
      icon: "success",
      title: "<span style='font-size:18px;'>Added to Wishlist</span>",
      html: `<span style='font-size:16px;'>${productRow.name} has been added to your wishlist.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleLoadMore = (e) => {
    e.preventDefault();
    lastScrollY.current = window.scrollY;
    loadMore();
  };

  return (
    <div ref={shopContainerRef}>
      <div className="bg-white">
        <div className="ps-breadcrumb">
          <div className="ps-container">
            <ul className="breadcrumb">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>Shop</li>
            </ul>
          </div>
        </div>

        <div className="ps-page--shop">
          <div className="ps-container mt-1">
            <Slider />

            <div
              className="subcat-stroke-container mt-3"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "nowrap",
                overflowX: "auto",
                gap: "10px",
              }}
            >
              {getCategories?.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleSelect(e, item)}
                  style={{
                    padding: "8px 9px",
                    borderRadius: "20px",
                    border: "1px solid #fcb800",
                    background:
                      selectedCategory === item.id ? "#fcb800" : "transparent",
                    color: selectedCategory === item.id ? "#000000" : "#0d6efd",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.3s ease",
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div
              style={{
                position: "sticky", // stays at bottom when scrolling
                bottom: 0,
                zIndex: 1000,
                background: "#fff",
                padding: "10px 0",
                borderTop: "1px solid #eee",
              }}
            >
              <div
                className="subcat-stroke-container"
                style={{
                  display: "flex",
                  alignItems: "center",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  padding: "0 10px",
                  gap: "10px",
                }}
              >
                {ChildCategorys?.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      handleSelect(e, item);
                      fetchinSubcategoryies(item.id);
                    }}
                    style={{
                      flex: "0 0 auto",
                      padding: "8px 9px",
                      borderRadius: "999px",
                      border: "1px solid #fcb800",
                      background:
                        selectedCategory === item.id ||
                        selectedSubcategory === item.id
                          ? "#fcb800"
                          : "#fff",
                      color:
                        selectedCategory === item.id ||
                        selectedSubcategory === item.id
                          ? "#000"
                          : "#333",
                      fontSize: "14px",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {inChildCategory.length > 0 && (
                <>
                  <hr />
                  <div
                    className="subcat-stroke-container"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      overflowX: "auto",
                      WebkitOverflowScrolling: "touch",
                      padding: "0 10px",
                      gap: "10px",
                    }}
                  >
                    {inChildCategory.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          // Toggle selection using inSelectedSubcategory
                          if (inSelectedSubcategory === item.id) {
                            setInSelectedSubcategory(null); // deselect if already selected
                            setInSubProducts([]); // clear products
                          } else {
                            setInSelectedSubcategory(item.id); // select
                            handleSelectSubCat(item.id); // fetch products
                          }
                        }}
                        style={{
                          flex: "0 0 auto",
                          padding: "8px 12px",
                          borderRadius: "999px",
                          border: "1px solid #fcb800",
                          background:
                            inSelectedSubcategory === item.id
                              ? "#fcb800"
                              : "#fff",
                          color:
                            inSelectedSubcategory === item.id ? "#000" : "#333",
                          fontSize: "14px",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                        }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="ps-layout--shop mt-2">
              <div className="ps-layout___right">
                <div className="ps-shopping ps-tab-root">
                  <div className="ps-shopping__header">
                    {/* <pre>{JSON.stringify(inSubProducts, null, 2)}</pre>  */}

                    <p>All Products</p>
                    <div className="ps-shopping__actions">
                      <div className="ps-shopping__view">
                        <ul className="ps-tab-list mb-3 d-none d-md-flex">
                          <li className={activeTab === "grid" ? "active" : ""}>
                            <a
                              href="#tab-1"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab("grid");
                              }}
                            >
                              <i className="icon-grid" />
                            </a>
                          </li>
                          <li className={activeTab === "list" ? "active" : ""}>
                            <a
                              href="#tab-2"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveTab("list");
                              }}
                            >
                              <i className="icon-list4" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="tab-content">
                    {/* Grid View */}
                    {activeTab === "grid" && (
                      <div className="ps-shopping-product">
                        <div className="row">
                          {/* <pre>{JSON.stringify(displayedProducts,null,2)}</pre> */}
                          {displayedProducts.map((product) => (
                            <div
                              className="col-xl-2 col-lg-6 col-md-4 col-sm-6 col-6 mt-2"
                              key={product.id}
                              style={{
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                              }}
                              title={product.fname}
                            >
                              <div
                                className="ps-product h-100 bg-white"
                                style={{
                                  border: "1px solid #e9ecef",
                                  borderRadius: "12px",
                                  transition: "all 0.25s ease",
                                  overflow: "hidden",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = "#0d6efd";
                                  e.currentTarget.style.boxShadow =
                                    "0 0.5rem 1rem rgba(0, 0, 0, 0.08)";
                                  e.currentTarget.style.transform =
                                    "translateY(-3px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "#e9ecef";
                                  e.currentTarget.style.boxShadow = "none";
                                  e.currentTarget.style.transform = "none";
                                }}
                              >
                                <div
                                  className={`image-wrapper ps-product__thumbnail ${
                                    loaded ? "loaded" : ""
                                  }`}
                                  style={{
                                    borderBottom: "1px solid #f1f1f1",
                                  }}
                                >
                                  <Link
                                    href={`/product-details/${product.slug}`}
                                  >
                                    <img
                                      loading="lazy"
                                      src={product.thumnail_img}
                                      alt={product.name}
                                      className="img-fluid"
                                      onLoad={() => setLoaded(true)}
                                    />
                                  </Link>

                                  <ul className="ps-product__actions">
                                    <li>
                                      <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        className="btn-icon"
                                      >
                                        <i className="icon-bag2" />
                                      </button>
                                    </li>
                                    <li>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleAddToWishList(product)
                                        }
                                        className="btn-icon"
                                      >
                                        <i className="icon-heart" />
                                      </button>
                                    </li>
                                  </ul>
                                </div>

                                <div className="ps-product__container">
                                  <div className="ps-product__content">
                                    <Link
                                      href={`/product-details/${product.slug}`}
                                      className="custom-link"
                                      style={{
                                        display: "block",
                                        fontWeight: "500",
                                        marginBottom: "4px",
                                        textAlign:"center"
                                      }}
                                    >
                                      {product.name.length > 20
                                        ? product.name.slice(0, 20) + "..."
                                        : product.name}
                                    </Link>

                                    <p
                                      className="ps-product__price"
                                      style={{ marginBottom: "0" }}
                                    >
                                      {product.discount_price ? (
                                        <>
                                          <span className="text-danger fw-bold">
                                            {product.currency}{" "}
                                            {product.discount_price}
                                          </span>{" "}
                                          <del className="text-muted">
                                            {product.currency} {product.price}
                                          </del>
                                        </>
                                      ) : (
                                        <>
                                          {product.currency} {product.price}
                                        </>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {hasMore && !loading && (
                            <div className="text-center mt-5 mb-5">
                              <button
                                onClick={handleLoadMore}
                                className="btn-load-more"
                              >
                                Load More
                              </button>
                            </div>
                          )}
                          {loading && displayedProducts.length > 0 && (
                            <div className="text-center mt-3 text-muted">
                              Loading more products...
                            </div>
                          )}
                          {!hasMore && (
                            <p className="text-center mt-3 text-secondary d-none">
                              No more products available.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* List View */}
                    {activeTab === "list" && (
                      <div className="ps-shopping-product">
                        {displayedProducts.map((product) => (
                          <div
                            className="ps-product ps-product--wide"
                            key={product.id}
                            style={{
                              textOverflow: "ellipsis",
                              cursor: "pointer",
                            }}
                            title={product.fname}
                          >
                            <div className="ps-product__thumbnail">
                              <Link href={`/product-details/${product.slug}`}>
                                <img
                                  loading="lazy"
                                  src={product.thumnail_img}
                                  alt={product.name}
                                  className="img-fluid"
                                />
                              </Link>
                            </div>

                            <div className="ps-product__container">
                              <div className="ps-product__content">
                                <Link
                                  className="ps-product__title"
                                  href={`/product-details/${product.slug}`}
                                >
                                  {product.name}
                                </Link>

                                <p className="ps-product__vendor">
                                  Sold by:{" "}
                                  <Link
                                    href={`/product-details/${product.slug}`}
                                    className="text-primary btn-as-link"
                                  >
                                    {product.vendor}
                                  </Link>
                                </p>

                                <div
                                  className="ps-product__desc text-justify"
                                  style={{
                                    textAlign: "justify",
                                    maxWidth: "800px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: product.description_full,
                                  }}
                                />
                              </div>

                              <div className="ps-product__shopping">
                                <p className="ps-product__price">
                                  {product.discount_price ? (
                                    <>
                                      <span className="text-danger fw-bold">
                                        {product.currency}{" "}
                                        {product.discount_price}
                                      </span>{" "}
                                      <del className="text-muted">
                                        {product.currency} {product.price}
                                      </del>
                                    </>
                                  ) : (
                                    <>
                                      {product.currency} {product.price}
                                    </>
                                  )}
                                </p>

                                <button
                                  className="ps-btn"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                  }}
                                >
                                  Add to cart
                                </button>

                                <ul className="ps-product__actions d-none">
                                  <li>
                                    <Link href="/whishlist">
                                      <i className="icon-heart" /> Wishlist
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}

                        {hasMore && !loading && (
                          <div className="text-center mt-5 mb-5">
                            <button
                              type="button"
                              className="btn-load-more"
                              onClick={handleLoadMore}
                            >
                              Load More
                            </button>
                          </div>
                        )}

                        {loading && products.length > 0 && (
                          <div className="text-center mt-3 text-muted">
                            Loading more products...
                          </div>
                        )}

                        {!hasMore && (
                          <p className="text-center mt-3 text-secondary">
                            No more products available.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .btn-as-link {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          cursor: pointer;
          text-decoration: underline;
        }
        .category-btn {
          background: none;
          border: none;
          padding: 0;
          color: inherit;
          cursor: pointer;
          font: inherit;
          text-align: left;
        }
        .ps-product__content a,
        .ps-product__vendor {
          color: black;
          text-decoration: none;
        }
        .ps-product__content a:hover,
        .ps-product__vendor:hover {
          color: black !important;
          text-decoration: none;
        }

        /* Large tablet / small desktop */
        @media (max-width: 1199px) {
          .ps-shopping {
            margin-top: 40px;
          }
        }

        /* Mobile devices */
        @media (max-width: 767px) {
          .ps-shopping {
            margin-top: 0px;
          }
        }
      `}</style>
    </div>
  );
}
