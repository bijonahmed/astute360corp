// app/components/ClientNavbar.js
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import TopNavbar from "./TopNavbar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCart } from "../../context/CartContext";
import useCategories from "../../hooks/useCategories";
import useProductSearch from "../../hooks/useProductSearch";
import "../../components/styles/autocmplete.css";

export default function InsideHeader() {
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { query, setQuery, products } = useProductSearch();
  const [selectedCategory, setSelectedCategory] = useState("0");
  const { cart, wishlist, updateQty, removeFromCart } = useCart();
  const { categoryData, loading } = useCategories();
  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);

        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ redirect to login page after short delay
        setTimeout(() => {
          router.push("/my-account");
        }, 1500);
      }
    });
  };

  // Toggle menu on button click
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div>
      {/* Header */}
      <header className="header header--1 sticky-top" data-sticky="true">
        <div className="header__top">
          <div className="ps-container">
            <div className="header__left">
              <Link className="_ps-logo" href="/">
                <img
                  loading="lazy"
                  src="/frontend_theme/img/logo.png"
                  className="w-100"
                  style={{ height: "60px" }}
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="header__content-center">
              <div className="ps-form--quick-search">
                <input
                  className="form-control"
                  type="text"
                  placeholder="I'm shopping for..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                />
                <button type="button" className="search-btn">
                  Search
                </button>

                {loading && <p className="search-loading">Loading...</p>}

                {products.length > 0 && isFocused && (
                  <ul className="search-results-dropdown">
                    {products.map((product) => (
                      <li key={product.id} className="search-result-item">
                        <Link href={`/product-details/${product.slug}`}>
                          <img
                            src={product.thumnail_img}
                            alt={product.name}
                            className="search-result-thumb"
                          />
                          <span className="search-result-name">
                            {product.name}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                {!loading && isFocused && query && products.length === 0 && (
                  <div className="search-no-results">No products found</div>
                )}
              </div>
            </div>
            <div className="header__right">
              <div className="header__actions">
                <Link className="header__extra" href="/whishlist">
                  <i className="icon-heart" />
                  <span>
                    <i>{wishlist?.length || 0}</i>
                  </span>
                </Link>
                {/* ---------- Cart Dropdown ---------- */}
                <div className="ps-cart--mini">
                  <Link className="header__extra" href="/cart">
                    <i className="icon-bag2" />
                    <span>
                      <i>{cart?.length || 0}</i>
                    </span>
                  </Link>
                  <div className="ps-cart__content">
                    <div className="ps-cart__items">
                      {cart.length > 0 ? (
                        cart.map((item) => {
                          const key = `${item.id}-${JSON.stringify(
                            item.selectedAttr
                          )}`;
                          return (
                            <div className="ps-product--cart-mobile" key={key}>
                              <div className="ps-product__thumbnail">
                                <a href="#">
                                  <img
                                    loading="lazy"
                                    src={item.thumnail_img || ""}
                                    alt={item.name || "Product image"}
                                    className="img-fluid"
                                  />
                                </a>
                              </div>
                              <div className="ps-product__content">
                                <a
                                  className="ps-product__remove"
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeFromCart(item);
                                  }}
                                >
                                  <i className="icon-cross" />
                                </a>
                                <a href="#">{item.name}</a>
                                <small>
                                  &nbsp;{item.qty} × Tk.{item.price}
                                </small>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-center py-3">Your cart is empty</p>
                      )}
                    </div>

                    <div className="ps-cart__footer">
                      <h3>
                        Sub Total:
                        <strong>
                          Tk.
                          {cart
                            .reduce(
                              (acc, item) => acc + item.price * item.qty,
                              0
                            )
                            .toFixed(2)}
                        </strong>
                      </h3>
                      <figure>
                        <Link className="ps-btn" href="/cart">
                          View Cart
                        </Link>
                        <Link className="ps-btn" href="/checkout">
                          Checkout
                        </Link>
                      </figure>
                    </div>
                  </div>
                </div>
                <div className="ps-block--user-header">
                  <div className="ps-block__left">
                    <i className="icon-user" />
                  </div>
                  <div className="ps-block__right">
                    {token ? (
                      <>
                        <Link href="/customer-dashboard">My Dashboard</Link>
                        <Link href="#" onClick={handleLogout}>
                          Logout
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/my-account">Login</Link>
                        <Link href="/register">Register</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="navigation">
          <div className="ps-container">
            <div className="navigation__left">
              {/* Start */}
              <div className="menu--product-categories">
                <div
                  className="menu__toggle d-flex align-items-center gap-2"
                  onClick={toggleMenu}
                >
                  <i className="icon-menu" />
                  <span>Shop by Bir Brands</span>
                </div>
                {/* Dropdown Content */}
                {menuOpen && (
                  <div className="menu__content">
                    <ul className="menu--dropdown">
                      {categoryData.map((parent) => (
                        <li
                          key={parent.id}
                          className={`menu-item-has-children has-mega-menu ${
                            parent.children && parent.children.length > 0
                              ? "has-sub"
                              : ""
                          }`}
                        >
                          <Link href={`/product-categories/${parent.slug}`}>
                            {parent.name}{" "}
                            {parent.children && parent.children.length > 0 && (
                              <>
                                <i className="fa-solid fa-chevrons-right" />
                                <i
                                  className="fa-solid fa-circle-chevron-right"
                                  style={{ marginLeft: "5px" }}
                                />
                              </>
                            )}
                          </Link>

                          {/* Mega Menu */}
                          {parent.children && parent.children.length > 0 && (
                            <div
                              className="mega-menu"
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                backgroundColor: "#f9f9f9",
                                padding: "10px",
                                borderRadius: "6px",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                maxWidth: "500px", // adjust as needed
                              }}
                            >
                              {parent.children &&
                                parent.children.length > 0 && (
                                  <ul
                                    className="mega-menu__list"
                                    style={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      padding: 0,
                                      margin: 0,
                                      listStyle: "none",
                                      width: "100%",
                                    }}
                                  >
                                    {parent.children.map((subItem, index) => (
                                      <li
                                        key={subItem.id}
                                        style={{
                                          width: "50%", // two columns
                                          padding: "5px 10px",
                                          boxSizing: "border-box",
                                        }}
                                      >
                                        <Link
                                          href={`/shop-categories/${subItem.slug}`}
                                          style={{
                                            textDecoration: "none",
                                            color: "#333",
                                            display: "block",
                                            padding: "5px",
                                            borderRadius: "4px",
                                            backgroundColor: "#fff",
                                            marginBottom: "3px",
                                          }}
                                        >
                                          {subItem.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                          )}
                        </li>
                      ))}
                      <li>
                        <Link href="/shop">All Products</Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {/* END */}
            </div>
            <div className="navigation__right">
              <ul className="menu">
                <li>
                  <Link href="/">Home</Link>
                  <span className="sub-toggle" />
                </li>
                <li>
                  <Link href="/shop">Shop</Link>
                  <span className="sub-toggle" />
                </li>
                <li>
                  <Link href="/about-us">About Bir Group</Link>
                  <span className="sub-toggle" />
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                {/* <li>
                  <Link href="/faq">Faq</Link>
                  <span className="sub-toggle" />
                </li> */}
                <li>
                  <Link href="/contact">Contact</Link>
                  <span className="sub-toggle" />
                </li>
              </ul>
              <ul className="navigation__extra">
                <li>
                  <Link href="/track-order">Tract your order</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <style jsx>{`
        @media (min-width: 992px) {
          .ps-home-banner {
            margin-top: 140px; /* height of top header + navigation */
          }
        }
        @media (max-width: 991.98px) {
          .ps-home-banner {
            margin-top: 0; /* mobile: no margin */
          }
        }
      `}</style>
      {/* Header */}
    </div>
  );
}
