"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import useCategories from "../../hooks/useCategories";
import useProductSearch from "../../hooks/useProductSearch";
import "../../components/styles/autocmpleteMobile.css";
import { useCart } from "../../context/CartContext";

export default function SidebarSystem() {
  const [activePanel, setActivePanel] = useState(null);
  const { categoryData, loading } = useCategories();
  const { query, setQuery, products, clearSearch } = useProductSearch();
  const [openParentId, setOpenParentId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { cart, wishlist, updateQty, removeFromCart } = useCart();
  // Calculate subtotal
  const subtotal = cart.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );
  const closeSidebar = () => {
    const sidebar = document.getElementById("search-sidebar");
    const overlay = document.querySelector(".ps-site-overlay");
    sidebar?.classList.remove("active");
    overlay?.classList.remove("active");
  };

  const handleSelectProduct = (product) => {
    clearSearch();
    setShowDropdown(false);
    closeSidebar();
  };

  useEffect(() => {
    const overlay = document.querySelector(".ps-site-overlay");
    if (!overlay) return;
    const handleClick = () => closeSidebar();
    overlay.addEventListener("click", handleClick);
    return () => overlay.removeEventListener("click", handleClick);
  }, []);

  const menuItems = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "About Bir Group", link: "/about-us" },
    { name: "Blog", link: "/blog" },
    { name: "Faq", link: "/faq" },
    { name: "Contact", link: "#" },
  ];

  const [openMenuIds, setOpenMenuIds] = useState([]);

  const toggleMenu = (id) => {
    setOpenMenuIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <div>
        <div className="navigation--list">
          <div className="navigation__content">
            <a
              className="navigation__item ps-toggle--sidebar"
              href="#menu-mobile"
            >
              <i className="icon-menu" />
              <span> Menu</span>
            </a>
            <a
              className="navigation__item ps-toggle--sidebar"
              href="#navigation-mobile"
            >
              <i className="icon-list4" />
              <span> Categories</span>
            </a>
            <a
              className="navigation__item ps-toggle--sidebar"
              href="#search-sidebar"
            >
              <i className="icon-magnifier" />
              <span>Search</span>
            </a>
            <a
              className="navigation__item ps-toggle--sidebar"
              href="#cart-mobile"
            >
              <i className="icon-bag2" />
              <span> Cart</span>
            </a>
          </div>
        </div>

        {/* Cart Categories */}
        <div className="ps-panel--sidebar" id="navigation-mobile">
          <div className="ps-panel__header">
            <h3>Categories</h3>
          </div>
          <div className="ps-panel__content">
            <div className="menu--product-categories">
              <div className="menu__toggle">
                <i className="icon-menu" />
                <span> Shop by Bir Brands</span>
              </div>
              {/* <pre>{JSON.stringify(categoryData, null, 2)}</pre> */}

              <ul
                className="list-unstyled m-0 p-0"
                style={{
                  paddingLeft: "15px",
                  paddingRight: "15px",
                }}
              >
                {categoryData
                  .filter((item) => item.parent_id === 0)
                  .map((parent) => (
                    <li
                      key={parent.id}
                      className="mb-2"
                      style={{
                        padding: "8px 10px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          parent.children && parent.children.length > 0
                            ? toggleMenu(parent.id)
                            : null
                        }
                      >
                        <a
                          href={`/product-categories/${parent.slug}`}
                          className="text-decoration-none text-dark fw-semibold"
                        >
                          {parent.name}
                        </a>
                        {parent.children && parent.children.length > 0 && (
                          <span style={{ fontSize: "12px" }}>
                            {openMenuIds.includes(parent.id) ? "▲" : "▼"}
                          </span>
                        )}
                      </div>

                      {parent.children && parent.children.length > 0 && (
                        <ul
                          className="list-unstyled mt-2"
                          style={{
                            paddingLeft: "25px",
                            paddingRight: "25px",
                            maxHeight: openMenuIds.includes(parent.id)
                              ? "500px"
                              : "0px",
                            overflow: "hidden",
                            transition: "max-height 0.3s ease-in-out",
                          }}
                        >
                          {parent.children.map((child) => (
                            <li
                              key={child.id}
                              className="mb-1"
                              style={{
                                padding: "5px 8px",
                                borderBottom: "1px dotted #ccc",
                              }}
                            >
                              <a
                               href={`/shop-categories/${child.slug}`}
                                className="text-decoration-none text-secondary"
                              >
                                {child.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Categories end*/}

        {/* Start menu*/}
        {/* Sidebar Panel */}
        <div className="ps-panel--sidebar" id="menu-mobile">
          <div className="ps-panel__header">
            <h3>Menu</h3>
          </div>

          <div className="ps-panel__content">
            <ul className="menu--mobile">
              {menuItems.map((item, index) => (
                <li className="menu-item-has-children" key={index}>
                  <a href={item.link}>{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* End menu*/}

        {/* Cart start */}
        <div>
          <div className="ps-site-overlay" />
          <div className="ps-panel--sidebar" id="cart-mobile">
            <div className="ps-panel__header">
              <h3>Shopping Cart</h3>
            </div>
            <div className="navigation__content">
              <div className="ps-cart--mobile">
                <div className="ps-cart__content">
                  {cart && cart.length > 0 ? (
                    cart.map((item) => {
                      const key = `${item.id}-${JSON.stringify(
                        item.selectedAttr || {}
                      )}`;
                      return (
                        <div
                          className="ps-product--cart-mobile d-flex align-items-start mb-3"
                          key={key}
                        >
                          {/* Product Thumbnail */}
                          <div className="ps-product__thumbnail me-3">
                            <Link href={`/product-details/${item.slug}`}>
                              <img
                                loading="lazy"
                                src={
                                  item.thumnail_img ||
                                  "/frontend_theme/img/default-product.jpg"
                                }
                                alt={item.name || "Product image"}
                                className="img-fluid rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                          </div>

                          {/* Product Content */}
                          <div className="ps-product__content flex-grow-1 position-relative">
                            <a
                              href="#"
                              className="ps-product__remove text-danger position-absolute top-0 end-0"
                              onClick={(e) => {
                                e.preventDefault();
                                removeFromCart(item);
                              }}
                            >
                              <i className="icon-cross" />
                            </a>

                            <Link
                              href={`/product-details/${item.slug}`}
                              className="d-block fw-semibold text-truncate"
                              title={item.name}
                            >
                              {item.name}
                            </Link>
                            <p className="mb-1 text-muted">
                              <strong>Sold by:</strong>{" "}
                              {item.seller || "YOUNG SHOP"}
                            </p>
                            <small className="text-muted">
                              {item.qty} ×{" "}
                              <span>
                                {item.price} =  Tk.{item.qty * item.price}
                              </span>
                            </small>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <i
                        className="icon-bag2 d-block mb-2"
                        style={{ fontSize: "32px", color: "#ccc" }}
                      />
                      <p className="mb-0 text-muted">Your cart is empty</p>
                    </div>
                  )}
                </div>
                {cart && cart.length > 0 && (
                  <div className="ps-cart__footer mt-3">
                    <h3>
                      Sub Total: <strong>Tk.{subtotal.toFixed(2)}</strong>
                    </h3>
                    <figure>
                      <Link className="ps-btn me-2" href="/cart">
                        View Cart
                      </Link>
                      <Link className="ps-btn" href="/checkout">
                        Checkout
                      </Link>
                    </figure>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Cart end */}

        {/* Start Search*/}
        <div className="ps-panel--sidebar" id="search-sidebar">
          <div className="ps-panel__header">
            <form
              className="ps-form--search-mobile"
              action="#"
              method="get"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-group--nest">
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search something..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => query && setShowDropdown(true)}
                />
                <button type="button">
                  <i className="icon-magnifier" />
                </button>

                {/* ✅ Autocomplete Dropdown */}
                {showDropdown && products.length > 0 && (
                  <ul className="search-results-mobile">
                    {products.map((product) => (
                      <li
                        key={product.id}
                        className="search-result-item-mobile"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <Link href={`/product-details/${product.slug}`}>
                          <div className="search-result-content-mobile">
                            <span className="search-result-name-mobile">
                              {product.name.split(" ").slice(0, 20).join(" ")}
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {loading && <p className="search-loading-mobile">Loading...</p>}
              </div>
            </form>
          </div>
          <div className="navigation__content" />
        </div>
        {/* End Search*/}
      </div>
      
    </div>
  );
}
