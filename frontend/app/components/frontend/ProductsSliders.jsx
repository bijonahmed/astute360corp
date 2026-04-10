"use client";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import useProductsLimit from "../../hooks/getProducts";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1280 }, items: 5 },
  desktop: { breakpoint: { max: 1280, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

export default function ProductsSliders() {
  const { products, loading } = useProductsLimit();
  const { cart, addToWishlist, wishlist, removeFromCart } = useCart();

  const { addToCart } = useCart();

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

  const handleAddToCart = (productRow) => {
    const product = {
      id: productRow.id,
      slug: productRow.slug,
      name: productRow.name,
      price: productRow.discount_price,
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
    addToCart(product);

    Swal.fire({
      icon: "success",
      title: "<span style='font-size:18px;'>Added to Cart</span>",
      html: `<span style='font-size:16px;'>"${product.name}" has been added to your cart.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="ps-deal-of-day mt-5">
      <div className="container">
        <div className="ps-section__header">
          <div className="ps-block--countdown-deal">
            <div className="ps-block__left">
              <h3>Deal of the day</h3>
            </div>
            <div className="ps-block__right"></div>
          </div>
          <Link href="/shop">View all</Link>
        </div>

        <div className="ps-section__content">
          <Carousel
            responsive={responsive}
            infinite
            autoPlay
            arrows={true}
            showDots={false}
            autoPlaySpeed={5000}
            swipeable
            containerClass="ps-carousel--nav owl-slider"
          >
            {products.map((product) => (
              <div key={product.id} className="ps-product ps-product--inner">
                <div className="ps-product__thumbnail">
                  <Link href={`/product-details/${product.slug}`}>
                    <img
                      loading="lazy"
                      src={product.thumnail_img}
                      alt=""
                      className="img-fluid"
                      style={{
                        height: "100%",
                        objectFit: "cover",
                        padding: '5px',
                        width: "100%",
                      }}
                    />
                  </Link>

                  <ul className="ps-product__actions">
                    <li>
                      <a
                        href="#"
                        title="Read More"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                      >
                        <i className="icon-bag2" />
                      </a>
                    </li>

                    <li>
                      <Link href={`/product-details/${product.slug}`}>
                        <i className="icon-eye" />
                      </Link>
                    </li>
                    <li>
                      <a href="#" title="Add to Wishlist" onClick={() =>
                                          handleAddToWishList(product)
                                        }>
                        <i className="icon-heart" />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="ps-product__container">
                  <a className="ps-product__vendor" href="#">
                    {product.vendor}
                  </a>
                  <div className="ps-product__content">
                    <Link
                      className="ps-product__title"
                      href={`/product-details/${product.slug}`}
                    >
                      {product.name}
                    </Link>

                    <p className="ps-product__price sale">
                      TK.{product.discount_price}
                      {product.price && <del>&nbsp;TK.{product.price}</del>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  );
}
