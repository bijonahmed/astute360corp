"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CartList() {
  const { cart, updateQty, removeFromCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  // Ensure cart renders only on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // prevent server/client mismatch

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (cart.length === 0)
    return <p className="text-center py-3">Your cart is empty</p>;

  return (
    <div className="ps-page--simple">
      <div className="ps-section--shopping ps-shopping-cart">
        <div className="container">
          <div className="ps-section__content">
            <div className="table-responsive">
              <table className="table ps-table--shopping-cart ps-table--responsive">
                <thead>
                  <tr>
                    <th>Product name</th>
                    <th>PRICE</th>
                    <th>QUANTITY</th>
                    <th>TOTAL</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={`${item.id}-${JSON.stringify(item.selectedAttr)}`}>
                      <td data-label="Product">
                        <div className="ps-product--cart">
                          <div className="ps-product__thumbnail">
                            <Link href={`/product-details/${item.slug}`}>
                              <img
                                loading="lazy"
                                src={item.thumnail_img || ""}
                                alt={item.name || "Product image"}
                              />
                            </Link>
                          </div>
                          <div className="ps-product__content">
                            <Link href={`/product-details/${item.slug}`}>
                              {item.name}
                            </Link>
                            <p className="d-none">
                              Sold By: <strong>YOUNG SHOP</strong>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="price" data-label="Price">
                        Tk.{item.price}
                      </td>
                      <td data-label="Quantity">
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) =>
                            updateQty(item, parseInt(e.target.value) || 1)
                          }
                          className="form-control"
                        />
                      </td>
                      <td data-label="Total" className="text-center">
                        {" "}
                        Tk.{item.qty * item.price}
                      </td>
                      <td data-label="Actions">
                        <button
                          className="btn btn-link text-danger"
                          onClick={() => {
                            Swal.fire({
                              title:
                                '<span style="font-size:20px;">Are you sure?</span>',
                              html: '<span style="font-size:16px;">Do you want to remove this item from your cart?</span>',
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#d33",
                              cancelButtonColor: "#3085d6",
                              confirmButtonText:
                                '<span style="font-size:16px;">Yes, remove it!</span>',
                              cancelButtonText:
                                '<span style="font-size:16px;">Cancel</span>',
                              customClass: {
                                popup: "swal2-font-custom",
                              },
                              // optional: allow HTML in text
                              focusConfirm: false,
                            }).then((result) => {
                              if (result.isConfirmed) {
                                removeFromCart(item);
                                Swal.fire({
                                  title:
                                    '<span style="font-size:18px;">Removed!</span>',
                                  html: '<span style="font-size:14px;">Item has been removed from your cart.</span>',
                                  icon: "success",
                                });
                              }
                            });
                          }}
                        >
                          <i className="icon-cross" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="ps-section__footer">
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 ">
            <div className="ps-block--shopping-total">
              <div className="ps-block__header">
                <p>
                  Subtotal <span> Tk. {cartTotal}</span>
                </p>
              </div>
            </div>
            <Link className="ps-btn ps-btn--fullwidth" href="/checkout">
              Proceed to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
