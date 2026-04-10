"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

import useProducts from "../../../hooks/getProductsByInSubCategories";
import "../../../components/styles/darknessLoader.css";
import "../../../components/styles/beforeLoading.css";
import "../../../components/styles/loadmore.css";
import Slider from "../../../components/frontend/Slider";
import useCategories from "../../../hooks/useProductsCategoriesAllData";
import { useCart } from "../../../context/CartContext";

import Swal from "sweetalert2";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const metadata = {
  title: "Shop - Bir E-Commerce",
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

export default function ShopByInSubCategoriesPage({ slug }) {
  const formattedSlug = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
  console.log("Rendering ShopByCategories for slug:", slug);

  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("grid"); // default view
  const { addToCart, addToWishlist, wishlist } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [qty, setQty] = useState(1);
  const { cart, updateQty, removeFromCart } = useCart();
  const { categoryData } = useCategories();
  const [openMenu, setOpenMenu] = useState(null);
  const lastScrollY = useRef(0);
  const shopContainerRef = useRef(null);
  //const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart();
  const { products, loading, hasMore, loadMore } = useProducts(
    40,
    selectedCategory,
    selectedSubcategory,
    slug
  );

  useEffect(() => {
    const root = shopContainerRef.current ?? document;
    const clickHandler = (e) => {
      const a = e.target.closest && e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (href === "#" || href === "" || href === null) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    root.addEventListener("click", clickHandler);
    return () => root.removeEventListener("click", clickHandler);
  }, []);

  useEffect(() => {
    if (!loading && lastScrollY.current) {
      window.scrollTo(0, lastScrollY.current);
      lastScrollY.current = 0;
    }
  }, [loading]);

  const handleSelect = (eOrCategory, maybeCategory = null) => {
    let e = null;
    let category = null;
    let parentId = null;

    if (maybeCategory) {
      e = eOrCategory;
      category = maybeCategory;
    } else {
      category = eOrCategory;
    }

    if (e && e.preventDefault) {
      e.preventDefault();
      e.stopPropagation();
    }

    lastScrollY.current = window.scrollY;

    if (category.parent_id && category.parent_id !== 0) {
      parentId = category.parent_id;
      setSelectedCategory(parentId); // always send parent category id
      setSelectedSubcategory(category.id); // optional
    } else {
      setSelectedCategory(category.id);
      setSelectedSubcategory(null); // reset
    }
  };

  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  const handleAddToCart = (productRow) => {
    //console.log("Adding to cart:", productRow);
    const product = {
      id: productRow.id,
      slug: productRow.slug,
      name: productRow.name,
      price: productRow.price,
      qty: 1,
      thumnail_img: productRow.thumnail_img,
      selectedAttr: [],
    };

    const isDuplicate = cart.some(
      (item) =>
        item.id === product.id && item.selectedAttr === product.selectedAttr
    );

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
      html: `<span style='font-size:16px;'>"${product.name}" has been added to your cart.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleAddToWishList = (productRow) => {
    console.log("Adding to wishlist:", productRow);
    const product = {
      id: productRow.id,
      slug: productRow.slug,
      name: productRow.name,
      price: productRow.price,
      thumnail_img: productRow.thumnail_img,
      selectedAttr: [],
    };

    // ✅ Check duplicates in wishlist
    const isDuplicate = wishlist.some((item) => item.id === product.id);

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

    // ✅ Add to wishlist
    addToWishlist(product);

    Swal.fire({
      icon: "success",
      title: "<span style='font-size:18px;'>Added to Wishlist</span>",
      html: `<span style='font-size:16px;'>${product.name} has been added to your wishlist.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  if (loading || !products) {
    return (
      <div className="darkness-loader-overlay">
        <div className="darkness-spinner"></div>
      </div>
    );
  }
  return (
    <div ref={shopContainerRef}>
      {/* Start */}
      <div className="bg-white">
        <div className="ps-breadcrumb">
          <div className="ps-container">
            <ul className="breadcrumb">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>Shop By Categories</li>
              <li>{formattedSlug}</li>
            </ul>
          </div>
        </div>
        <div className="ps-page--shop">
          <div className="ps-container mt-5">
            <Slider />

            <div className="ps-layout--shop mt-4">
              <div className="ps-layout____right">
                <div className="ps-shopping ps-tab-root">
                  <center>
                    {loading && products.length === 0 && (
                      <p className="text-center text-muted">
                        Loading products...
                      </p>
                    )}
                  </center>
                  <div className="ps-shopping__header">
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
                  {/* Start tabs */}
                  <div className="tab-content">
                    {/* Grid View */}
                    {activeTab === "grid" && (
                      <div className="ps-shopping-product">
                        <div className="row">
                          {products.map((product) => (
                            <div
                              className="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-6"
                              key={product.id}
                            >
                              <div className="ps-product ">
                                <div
                                  className={`image-wrapper ps-product__thumbnail ${
                                    loaded ? "loaded" : ""
                                  }`}
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
                                      {/* this Link uses onClick preventDefault already */}
                                      <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        data-bs-toggle="tooltip"
                                        data-placement="top"
                                        title="Add To Cart"
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
                                        data-bs-toggle="tooltip"
                                        data-placement="top"
                                        title="Add To Wishlist"
                                        className="btn-icon"
                                      >
                                        <i className="icon-heart" />
                                      </button>
                                    </li>
                                  </ul>
                                </div>

                                <div className="ps-product__container">
                                  {/* vendor anchor had href="#" previously — avoid anchors without handlers */}
                                  <Link
                                    href={`/product-details/${product.slug}`}
                                    className="ps-product__vendor"
                                  >
                                    {product.vendor}
                                  </Link>

                                  <div className="ps-product__content">
                                    <Link
                                      className="ps-product__title"
                                      href={`/product-details/${product.slug}`}
                                    >
                                      {product.name}
                                    </Link>
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
                                  </div>

                                  <div className="ps-product__content hover">
                                    <Link
                                      className="ps-product__title"
                                      href={`/product-details/${product.slug}`}
                                    >
                                      {product.name}
                                    </Link>
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {hasMore && !loading && (
                            <div className="text-center mt-5 mb-5">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  loadMore();
                                }}
                                className="btn-load-more"
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
                        {products.map((product) => (
                          <div
                            className="ps-product ps-product--wide"
                            key={product.id}
                          >
                            <div className="ps-product__thumbnail">
                              <Link href={`/shop/details/${product.slug}`}>
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
                                  href={`/shop/details/${product.slug}`}
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

                                <ul className="ps-product__actions">
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
                              onClick={(e) => {
                                e.preventDefault();
                                loadMore();
                              }}
                              className="btn-load-more"
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
                          <p className="text-center mt-3 text-secondary d-none">
                            No more products available.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  {/* End Tabs  */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* END */}
      <style jsx>{`
        .btn-icon {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        /* make button look like links where used */
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
      `}</style>
    </div>
  );
}
