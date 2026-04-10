"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductSlider from "./ProductSlider";
import RelatedProducts from "./RelatedProducts";
import { useRouter } from "next/navigation";
import styles from "./ProductDetail.module.css";
import "../../../components/styles/darknessLoader.css";
import { useCart } from "../../../context/CartContext";
import Swal from "sweetalert2";

export default function ProductDetailsClient({ slug }) {
  const formattedSlug = slug.replace(/-/g, " ");
  const [productRow, setProductData] = useState(null);
  const [galleryData, setGalleryData] = useState([]);
  const [relatedProducts, setRelatedProductsData] = useState([]);
  const [attributesData, setAttributesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState(null);
  const [price, setPrice] = useState(null);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const { cart, updateQty, removeFromCart } = useCart();

  const handleIncrement = () => setQty((prev) => prev + 1);
  const handleDecrement = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    const product = {
      id: productRow.id,
      slug: productRow.slug,
      name: productRow.name,
      price: price,
      qty: qty,
      thumnail_img: productRow.thumnail_img,
      //selectedAttr: selectedAttr,
      selectedAttr: selectedAttr?.id ?? null,
      selectedAttrName: selectedAttr?.name ?? null,
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
    addToCart(product);

    Swal.fire({
      icon: "success",
      title: "<span style='font-size:18px;'>Added to Cart</span>",
      html: `<span style='font-size:16px;'>"${product.name}" has been added to your cart.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const router = useRouter();

  const handleAddToCartBuyNow = () => {
    const product = {
      id: productRow.id,
      slug: productRow.slug,
      name: productRow.name,
      price: price,
      qty: qty,
      thumnail_img: productRow.thumnail_img,
      selectedAttr: selectedAttr?.id ?? null,
      selectedAttrName: selectedAttr?.name ?? null,
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

      // 🔥 Already in cart → directly redirect to checkout
      setTimeout(() => {
        router.push("/checkout");
      }, 1600);

      return;
    }

    // Add to cart
    addToCart(product);
    setTimeout(() => {
      router.push("/checkout");
    }, 1600);

    return;
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setQty(isNaN(value) || value < 1 ? 1 : value); // always >=1
  };

  //console.log("Added to cart:", product);
  // Update price when selectedAttr changes
  useEffect(() => {
    if (selectedAttr && attributesData.length) {
      const selected = attributesData.find(
        (attr) => attr.id === parseInt(selectedAttr)
      );
      if (selected) setPrice(selected.sellingPrice);
    } else if (productRow) {
      setPrice(productRow.discount_price);
    }
  }, [selectedAttr, attributesData, productRow]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/public/checkProductDetails/${slug}`
        );
        const result = await res.json();

        setProductData(result.product || {});
        setGalleryData(result.gallery || []);
        setRelatedProductsData(result.related_prdoucts || []);
        setAttributesData(result.attributes || []);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);
  const images = galleryData.map((item) => item.gallery_image);

  if (loading || !productRow) {
    return (
      <div className="darkness-loader-overlay">
        <div className="darkness-spinner"></div>
      </div>
    );
  }

  return (
    <div className="ps-page--simple">
      {/* Breadcrumb */}
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>{productRow.name}</li>
          </ul>
        </div>
      </div>

      {/* Product details */}
      <div className="ps-container mt-3">
        <div className="ps-page__container">
          <div className="ps-page__left">
            <div className="ps-product--detail ps-product--fullwidth">
              <div className={styles["ps-product--detail"]}>
                <div className="ps-product__thumbnail">
                  <ProductSlider images={images} />
                </div>
                <div className="ps-product__info ms-2">
                  <h1>{productRow.name}</h1>
                  <div className="ps-product__meta">
                    <p>
                      Brand: <a href="#">BIR GROUP</a>
                    </p>
                  </div>

                  {/* Display price dynamically */}
                  <h4 className="ps-product__price">Tk.{price}</h4>

                  {/* Description */}
                  <div
                    className="ps-product__desc text-justify"
                    dangerouslySetInnerHTML={{
                      __html: productRow.description_full,
                    }}
                  />

                  {/* Attribute dropdown */}
                  {attributesData && attributesData.length > 0 && (
                    <>
                      {" "}
                      <div className="mb-4">
                        <label className="form-label fw-bold fs-5 text-dark">
                          Attribute:
                        </label>
                        <select
                          className="form-select form-select-lg border-2 shadow-sm"
                          style={{ fontSize: "15px", padding: "0.75rem 1rem" }}
                          value={
                            selectedAttr ? JSON.stringify(selectedAttr) : ""
                          }
                          onChange={(e) => {
                            const value = e.target.value;

                            if (!value) {
                              setSelectedAttr(null); // No selection → NULL
                            } else {
                              setSelectedAttr(JSON.parse(value)); // {id, name}
                            }
                          }}
                        >
                          <option value="">Select option</option>

                          {attributesData.map((attr) => (
                            <option
                              key={attr.id}
                              value={JSON.stringify({
                                id: attr.id,
                                name: attr.attributeName,
                              })}
                            >
                              {attr.attributeName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Shopping buttons */}
                  <div className="ps-product__shopping">
                    <figure>
                      <figcaption>Quantity</figcaption>
                      <div className="form-group--number">
                        <button
                          type="button"
                          className="up"
                          onClick={handleIncrement}
                        >
                          <i className="fa-solid fa-plus" />
                        </button>
                        <button
                          type="button"
                          className="down"
                          onClick={handleDecrement}
                        >
                          <i className="fa-solid fa-minus" />
                        </button>
                        <input
                          className="form-control"
                          type="text"
                          value={qty}
                          onChange={handleChange}
                          placeholder="1"
                        />
                      </div>
                    </figure>
                    <a
                      className="ps-btn ps-btn--black"
                      href="#"
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </a>
                    <Link
                      className="ps-btn"
                      href="#"
                      onClick={handleAddToCartBuyNow}
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>

              {/* Description tab */}
              <div className="ps-product__content ps-tab-root">
                <ul className="ps-tab-list">
                  <li className="active">
                    <a href="#tab-1">Description</a>
                  </li>
                </ul>
                <div className="ps-tabs">
                  <div className="ps-tab active" id="tab-1">
                    <div className="ps-document">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: productRow.description_full,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}
