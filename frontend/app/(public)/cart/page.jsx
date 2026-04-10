import Link from "next/link";
import CartList from "../cart/cartList"; // Client component

export const metadata = {
  title: "Cart - Bir E-Commerce",
  description: "Securely complete your order and payment on Bir E-Commerce.",
};

export default function CartPage() {
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
            <li>Cart</li>
          </ul>
        </div>
      </div>
      <div className="ps-section--shopping ps-shopping-cart">
        <div className="container">
          <CartList /> {/* Client component */}
        </div>
      </div>
    </div>
  );
}
