"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, username } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getNormalized = (p = "") => {
    const noQuery = p.split("?")[0].split("#")[0];
    if (noQuery === "/") return "/";
    return noQuery.replace(/\/+$/, "");
  };

  const current = useMemo(() => getNormalized(pathname || "/"), [pathname]);

  const isActive = (href, { allowSubroutes = true } = {}) => {
    const normHref = getNormalized(href);
    if (normHref === "/") return current === "/";
    if (allowSubroutes) {
      return current === normHref || current.startsWith(normHref + "/");
    }
    return current === normHref;
  };

  return (
    <aside className="ps-widget--account-dashboard">
      <div className="ps-widget__header">
        <img loading="lazy" src="/frontend_theme/img/users/1.png" alt="image" />
        <figure>
          <figcaption>Hello</figcaption>
          <p>{mounted ? username : null}</p>
        </figure>
      </div>
      <div className="ps-widget__content">
        <ul>
          <li className={isActive("/customer-dashboard") ? "active" : ""}>
            <Link href="/customer-dashboard">
              <i className="icon-user" /> Account Information
            </Link>
          </li>
          <li className={isActive("/invoice") ? "active" : ""}>
            <Link href="/invoice">
              <i className="icon-papers" /> Invoices
            </Link>
          </li>
          <li className={isActive("/whishlist") ? "active" : ""}>
            <Link href="/whishlist">
              <i className="icon-heart" /> Wishlist
            </Link>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();

                try {
                  // 🔹 Clear token / localStorage
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");

                  // 🔹 If you have context logout:
                  // logout();
                } finally {
                  // 🔹 Go to login page first
                  router.push("/login");

                  // 🔹 Reload page after small delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 300); // 300ms delay so Next.js can redirect
                }
              }}
            >
              <i className="icon-power-switch" />
              Logout
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
