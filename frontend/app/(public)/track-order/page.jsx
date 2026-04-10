import Link from "next/link";
import TrackOrderList from "./TrackOrderList";

 
export const metadata = {
  title: "Track Order - Bir E-Commerce",
  description: "Securely complete your order and payment on Bir E-Commerce.",
};

export default function TrackkSEOPage() {
  return (
    <div>
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Track Order</li>
          </ul>
        </div>
      </div>

      {/* 👇 PASS CATEGORY_ID = 1 */}
      <TrackOrderList />
    </div>
  );
}
