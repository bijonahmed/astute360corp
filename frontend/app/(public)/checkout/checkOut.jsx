"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "react-qr-code";
import "../../components/styles/checkout.css";
import toast, { Toaster } from "react-hot-toast";
import useSetting from "../../hooks/useSetting";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function CheckoutPage() {
  // Router
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userdata, setUserdata] = useState(null);
  const [address, setAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [your_bkash_number, setYourBkashNumber] = useState("");
  const [bkash_transaction_id, setBkashTransactionId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [error, setError] = useState("");
  const [discount, setDiscount] = useState(0);
  const [disAmt, setDisAmt] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedDeliveryCharge, setSelectedDeliveryCharge] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");

  const { token } = useAuth();

  const { cart, clearCart } = useCart();
  const { settingData, loading } = useSetting();

  // Mount check to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Subtotal and total calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const total =
    discount > 0
      ? subtotal - disAmt + selectedDeliveryCharge
      : subtotal + selectedDeliveryCharge;

  // Fetch userdata if token exists
  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) setUserdata(data.user);
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchUser();
  }, [token]);

  // Coupon application
  const applyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      const amt = subtotal * 0.1;
      setDiscount(10);
      setDisAmt(amt);
      setGrandTotal(subtotal - amt);
      setError("");
    } else {
      setError("Invalid coupon code");
      setDiscount(0);
      setDisAmt(0);
    }
  };

  // Validation and confirm order
  const confirmOrder = async (e) => {
    e.preventDefault();
    if (!mounted) return;

    const localCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (localCart.length === 0) {
      toast.error("Cart is empty. Please add items.");
      return;
    }

    // Bkash validation (for all users)
    if (paymentMethod === "bkash") {
      if (!your_bkash_number?.trim() || !bkash_transaction_id?.trim()) {
        toast.error("Please provide Bkash number and transaction ID.");
        return;
      }
    }

    // ==========================
    // 🔥 MAIN TOKEN VALIDATION
    // ==========================
    if (token) {
      // Logged-in users → only shipping info required
      if (!shippingPhone?.trim()) {
        showValidationError(
          "Shipping Phone Required",
          "Please enter your shipping phone."
        );
        return;
      }

      if (!address?.trim()) {
        showValidationError("Address Required", "Please enter your address.");
        return;
      }

      if (!paymentMethod?.trim()) {
        showValidationError(
          "Payment Method Required",
          "Please select a payment method."
        );
        return;
      }
    } else {
      // Guest checkout → ALL fields required
      if (!name?.trim()) {
        showValidationError("Name Required", "Please enter your full name.");
        return;
      }

      if (!email?.trim()) {
        showValidationError(
          "Email Required",
          "Please enter your email address."
        );
        return;
      }

      if (!phone?.trim()) {
        showValidationError(
          "Phone Required",
          "Please enter your phone number."
        );
        return;
      }

      // Phone must be 11 digits
      if (!/^[0-9]{11}$/.test(phone)) {
        showValidationError(
          "Invalid Phone Number",
          "Phone number must be exactly 11 digits."
        );
        return;
      }

      if (!address?.trim()) {
        showValidationError("Address Required", "Please enter your address.");
        return;
      }

      if (!shippingPhone?.trim()) {
        showValidationError(
          "Shipping Phone Required",
          "Please enter your shipping phone."
        );
        return;
      }

      if (!paymentMethod?.trim()) {
        showValidationError(
          "Payment Method Required",
          "Please select a payment method."
        );
        return;
      }
    }

    if (!token) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.trim())) {
        toast.error("Invalid email address.");
        return;
      }

      if (!/^[0-9]{11}$/.test(phone) || !/^[0-9]{11}$/.test(shippingPhone)) {
        toast.error("Phone numbers must be exactly 11 digits.");
        return;
      }
    }

    // Shipping validation
    if (!selectedDeliveryCharge) {
      toast.error("Please select a shipping option.");
      return;
    }

    const coupon = localStorage.getItem("apply_coupon") || null;
    const couponoffer = localStorage.getItem("coupon-offer") || null;
    const finalEmail = token && userdata?.email ? userdata.email : email; //token ? userdata?.email : email;
    const data = {
      name,
      email: finalEmail,
      phone,
      address,
      shipping_phone: shippingPhone,
      devliery_charge: selectedDeliveryCharge,
      bkash_number: your_bkash_number,
      transaction_id: bkash_transaction_id,
      paymentMethod,
      cart: localCart,
      coupon,
      couponoffer,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/confirOrders/confirm-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart: localCart, coupon, couponoffer, data }),
        }
      );

      const result = await response.json();
      if (result.success) {
        toast.success("Order Confirmed!");
        clearCart();
        localStorage.removeItem("apply_coupon");
        localStorage.removeItem("coupon-offer");
        window.dispatchEvent(new Event("cart-updated"));

        router.push(
          `/order-confirm/?email=${result.checkEmail}&password=${result.password}&order_id=${result.order_id}`
        );
      } else {
        toast.error(result.message || "Order failed.");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
      console.error(err);
    }
  };

  function showValidationError(title, message) {
    toast.error(`${title}: ${message}`);
  }
  useEffect(() => {
    if (settingData?.devliery_charge_inside_dhk) {
      setSelectedDeliveryCharge(Number(settingData.devliery_charge_inside_dhk));
    }
  }, [settingData]);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <form className="checkout-form" onSubmit={confirmOrder}>
          <div className="checkout-row">
            <Toaster position="top-right" />
            <div className="checkout-billing">
              <h4>Billing Details</h4>
              {token && userdata ? (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <b>{userdata?.name || ""}</b>
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <b>{userdata?.email || ""}</b>
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <b>{userdata?.phone_number || ""}</b>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]*$/.test(value) || value.length > 11)
                          return;
                        setPhone(value);
                      }}
                      placeholder="Enter your phone number"
                      maxLength={11}
                    />
                  </div>
                </>
              )}

              <h4>Shipping Address</h4>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={shippingPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!/^[0-9]*$/.test(value) || value.length > 11) return;
                    setShippingPhone(value);
                  }}
                  placeholder="Enter your shipping phone number"
                  maxLength={11}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your shipping address"
                />
              </div>

              <h4>Payment method</h4>

              <div className="payment-buttons d-flex gap-3 mb-3">
                {/* Cash Button */}
                <div
                  className={`payment-option-inline ${
                    paymentMethod === "cash" ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <img
                    src="/cash-on-delivery.png"
                    alt="Cash"
                    className="payment-icon"
                  />
                  <span>Cash on Delivery</span>
                </div>

                {/* Bkash Button */}
                <div
                  className={`payment-option-inline ${
                    paymentMethod === "bkash" ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod("bkash")}
                >
                  <img
                    src="/bkashlogo.svg"
                    alt="Bkash"
                    className="payment-icon"
                  />
                  <span>Bkash</span>
                </div>
              </div>

              {/* <h4>Payment method</h4>
              <div className="form-group">
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">-Select Payment Method-</option>
                  <option value="cash">Cash on Delivery</option>
                  <option value="bkash">Bkash</option>
                </select>
              </div> */}

              {paymentMethod === "bkash" && mounted && (
                <div>
                  <hr />
                  <div style={{ textAlign: "center" }}>
                    <QRCode
                      value={settingData?.bkash_number || "No number available"}
                      size={150}
                    />
                    <br />
                    <strong>Account Type:</strong> Personal <br />
                    <strong>Account Number:</strong> {settingData?.bkash_number}
                  </div>
                  <hr />
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Bkash Account Number"
                      value={your_bkash_number}
                      onChange={(e) => {
                        const input = e.target.value;
                        if (/^\d{0,11}$/.test(input)) setYourBkashNumber(input);
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Bkash Transaction ID"
                      value={bkash_transaction_id}
                      onChange={(e) => setBkashTransactionId(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-summary">
              <h3 className="checkout-heading">Your Order</h3>
              <div className="order-content">
                {cart?.length === 0 ? (
                  <p className="empty-cart text-center">Your cart is empty</p>
                ) : (
                  <>
                    <table className="order-table">
                      <tbody>
                        {cart.map((item) => (
                          <tr
                            key={`${item.id}-${item.selectedAttr || item.id}`}
                          >
                            <td className="product-info">
                              <div className="product-item">
                                <img
                                  src={item.thumnail_img || "/placeholder.png"}
                                  alt={item.name}
                                  className="product-image"
                                />
                                <div className="product-details">
                                  <p className="product-name">
                                    {item.name} ({item.qty} × Tk.{item.price})
                                  </p>
                                  {item.selectedAttrName && (
                                    <p
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {item.selectedAttrName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="product-price">
                              Tk.{(item.price * item.qty).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="checkout__total--amount d-flex gap-2">
                      {/* Inside Dhaka */}
                      <label
                        className={`delivery-option inline-option ${
                          selectedDeliveryCharge ===
                          Number(settingData.devliery_charge_inside_dhk)
                            ? "active"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingOption"
                          value={settingData.devliery_charge_inside_dhk}
                          checked={
                            selectedDeliveryCharge ===
                            Number(settingData.devliery_charge_inside_dhk)
                          }
                          onChange={() =>
                            setSelectedDeliveryCharge(
                              Number(settingData.devliery_charge_inside_dhk)
                            )
                          }
                        />

                        <div className="label-content">
                          Inside Dhaka ({settingData.currency}
                          {settingData.devliery_charge_inside_dhk})
                        </div>
                      </label>

                      {/* Outside Dhaka */}
                      <label
                        className={`delivery-option inline-option ${
                          selectedDeliveryCharge ===
                          Number(settingData.devliery_charge_outside_dhk)
                            ? "active"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="shippingOption"
                          value={settingData.devliery_charge_outside_dhk}
                          checked={
                            selectedDeliveryCharge ===
                            Number(settingData.devliery_charge_outside_dhk)
                          }
                          onChange={() =>
                            setSelectedDeliveryCharge(
                              Number(settingData.devliery_charge_outside_dhk)
                            )
                          }
                        />

                        <div className="label-content">
                          Outside Dhaka ({settingData.currency}
                          {settingData.devliery_charge_outside_dhk})
                        </div>
                      </label>
                    </div>

                    <div className="order-totals">
                      <p className="subtotal">
                        Subtotal: <span>Tk.{subtotal.toFixed(2)}</span>
                      </p>
                      <p className="total">
                        Total: <span>Tk.{total.toFixed(2)}</span>
                      </p>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="checkout-btn"
                  style={{
                    backgroundColor: "#f7c948",
                    border: "none",
                    color: "#000",
                  }}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
