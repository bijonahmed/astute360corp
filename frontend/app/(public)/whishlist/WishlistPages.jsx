"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import Swal from "sweetalert2";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
  title: "Wishlist - Bir E-Commerce",
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
    title: "Wishlist - Bir E-Commerce",
    description: "Securely complete your order and payment on Bir E-Commerce.",
    url: `${baseUrl}/wishlist`,
    siteName: "Bir E-Commerce",
    images: [
      {
        url: "/og-image-checkout.jpg",
        width: 1200,
        height: 630,
        alt: "Wishlist Page Preview - Bir E-Commerce",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/wishlist`,
  },
};

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    Swal.fire({
      icon: "success",
      title: `<span style="font-size:24px;">Added to Cart</span>`,
      html: `<span style="font-size:18px;">"${product.name}" has been added to your cart.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleRemove = (product) => {
    removeFromWishlist(product);
    Swal.fire({
      icon: "success",
      title: `<span style="font-size:24px;">Removed</span>`,
      html: `<span style="font-size:18px;">"${product.name}" has been removed from your wishlist.</span>`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="ps-page--simple">
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/shop">Shop</Link>
            </li>
            <li>Wishlist</li>
          </ul>
        </div>
      </div>

      <div className="ps-section--shopping ps-wishlist">
        <div className="container">
          <div className="ps-section__header">
            <h1>Wishlist</h1>
          </div>

          <div className="ps-section__content">
            {wishlist.length === 0 ? (
              <p>Your wishlist is empty.</p>
            ) : (
              <div className="table-responsive">
                <table className="table ps-table--wishlist ps-table--responsive">
                  <thead>
                    <tr>
                      <th>Remove</th>
                      <th>Product name</th>
                      <th>Unit Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((product) => (
                      <tr key={product.id}>
                        <td data-label="Remove">
                          <button
                            type="button"
                            onClick={() => handleRemove(product)}
                            className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                            style={{
                              minWidth: "20px",
                              minHeight: "20px",
                              borderRadius: "8px",
                              fontSize: "11px",
                            }}
                            title="Remove from wishlist"
                          >
                            <i className="icon-cross" />
                          </button>
                        </td>

                        <td data-label="Product">
                          <div className="ps-product--cart">
                            <div className="ps-product__thumbnail">
                              <Link href={`/product-details/${product.slug}`}>
                                <img
                                  loading="lazy"
                                  src={product.thumnail_img}
                                  alt={product.name}
                                />
                              </Link>
                            </div>
                            <div className="ps-product__content">
                              <Link href={`/product-details/${product.slug}`}>
                                {product.name}
                              </Link>
                              {product.vendor && (
                                <p>
                                  Sold By: <strong>{product.vendor}</strong>
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="price" data-label="Price">
                          TK. {product.price}
                        </td>

                        <td data-label="Action">
                          <button
                            type="button"
                            className="ps-btn"
                            onClick={() => handleAddToCart(product)}
                          >
                            Add to cart
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
