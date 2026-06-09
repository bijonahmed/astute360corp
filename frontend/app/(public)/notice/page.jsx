import Link from "next/link";
import ClientPostList from "./ClientPostList";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata = {
  title: "Notice",
  description: "Securely complete your order and payment on Bir E-Commerce.",
};

export default function AboutPage() {
  return (
    <div>
       
          <div className="container">
            <div className="page-title-content text-start">
              <h2>Notice</h2>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>Notice</li>
              </ul>
            </div>
          </div>
     

      {/* 👇 PASS CATEGORY_ID = 1 */}
      <ClientPostList />
    </div>
  );
}
