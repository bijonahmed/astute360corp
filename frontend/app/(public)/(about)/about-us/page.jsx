import Link from "next/link";
import ClientPostList from "./ClientPostList";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
  title: "About us - Bir E-Commerce",
  description: "Securely complete your order and payment on Bir E-Commerce.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>About us</li>
          </ul>
        </div>
      </div>

      {/* 👇 PASS CATEGORY_ID = 1 */}
      <ClientPostList categoryId={1} />
    </div>
  );
}
