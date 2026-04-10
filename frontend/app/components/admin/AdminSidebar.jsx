// app/components/AdminSidebar.js
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
  const { isLoggedIn, logout, roles } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const menuLinks = document.querySelectorAll(".nav-item > a");

    const handleClick = (e) => {
      const parent = e.currentTarget.parentElement;
      if (parent.querySelector(".nav-treeview")) {
        e.preventDefault();
        parent.classList.toggle("menu-open");
      }
    };

    menuLinks.forEach((link) => link.addEventListener("click", handleClick));

    return () => {
      menuLinks.forEach((link) =>
        link.removeEventListener("click", handleClick)
      );
    };
  }, []);

  // Sidebar links JSON
  const sidebarLinks = [
    { label: "My Dashboard", href: "/dashboard", icon: "bi-speedometer" },
    { label: "Profile", href: "/profile", icon: "bi-palette" },
    {
      label: "Users",
      href: "#",
      icon: "bi-box-seam-fill",
      children: [{ label: "User List", href: "/user", icon: "bi-circle" }],
    },
    {
      label: "Post Management",
      href: "#",
      icon: "nav-icon bi bi-ui-checks-grid",
      children: [
        { label: "Post Category", href: "/postcategories", icon: "bi-circle" },
        { label: "Post", href: "/post", icon: "bi-circle" },
      ],
    },

    // ✅ SHOW ONLY IF ADMIN
    ...(roles.includes("admin")
      ? [
          {
            label: "Categories",
            href: "#",
            icon: "bi-box-seam-fill",
            children: [
              {
                label: "Category",
                href: "/product-categories-manage",
                icon: "bi-circle",
              },
            ],
          },
          {
            label: "Banner Management",
            href: "#",
            icon: "nav-icon bi bi-ui-checks-grid",
            children: [
              {
                label: "Banner",
                href: "/banner",
                icon: "bi-circle",
              },
            ],
          },
          /*
          {
            label: "Supplier Management",
            href: "#",
            icon: "nav-icon bi bi-ui-checks",
            children: [
              {
                label: "Supplier List",
                href: "/supplier",
                icon: "bi-circle",
              },
            ],
          },
          {
            label: "Purchase Management",
            href: "#",
            icon: "bi-box-seam-fill",
            children: [
              {
                label: "Purchase List",
                href: "/purchase",
                icon: "bi-circle",
              },
            ],
          },
*/
           {
            label: "Product Management",
            href: "#",
            icon: "nav-icon bi bi-ui-checks",
            children: [
              {
                label: "Product List",
                href: "/product",
                icon: "bi-circle",
              },
            ],
          },
          /*
          {
            label: "Order Management",
            href: "#",
            icon: "bi-box-seam-fill",
            children: [
              {
                label: "Order List",
                href: "/order",
                icon: "bi-circle",
              },
            ],
          },

          {
            label: "Inventory Management",
            href: "#",
            icon: "bi-box-seam-fill",
            children: [
              {
                label: "My Inventory",
                href: "/inventory",
                icon: "bi-circle",
              },
            ],
          },

          {
            label: "Customer Management",
            href: "#",
            icon: "nav-icon bi bi-ui-checks",
            children: [
              {
                label: "Customer List",
                href: "/customer",
                icon: "bi-circle",
              },
            ],
          },
*/
          {
            label: "System Management",
            href: "#",
            icon: "nav-icon bi bi-ui-checks-grid",
            children: [
              //{ label: "Roles Manage", href: "/roles", icon: "bi-circle" },
              { label: "Permission Manage", href: "/permission", icon: "bi-circle"},
              { label: "Website Setting", href: "/setting", icon: "bi-circle" },
            ],
          },
        ]
      : []),
  ];

  const handleToggle = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      {/*begin::Sidebar*/}
      <aside
        className="app-sidebar bg-body-secondary shadow"
        data-bs-theme="dark"
      >
        {/* Sidebar Brand */}
        <div className="sidebar-brand">
          <Link href="/dashboard" className="brand-link">
            <img
              src="/src/assets/img/AdminLTELogo.png"
              alt="FG Logo"
              className="brand-image opacity-75 shadow"
            />
            <span className="brand-text fw-light">FG</span>
          </Link>
        </div>

        {/* Sidebar Wrapper */}
        <div className="sidebar-wrapper">
          <nav>
            <ul
              className="nav sidebar-menu flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {sidebarLinks.map((link) => (
                <li
                  key={link.label}
                  className={`nav-item ${link.children ? "has-treeview" : ""} ${
                    openMenu === link.label ? "menu-open" : ""
                  }`}
                  style={{ marginBottom: "2px" }}
                >
                  {link.children ? (
                    <>
                      {/* Parent toggle */}
                      <button
                        type="button"
                        className="nav-link btn-toggle"
                        onClick={() => handleToggle(link.label)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <i
                            className={`nav-icon bi ${link.icon}`}
                            style={{ marginRight: "8px" }}
                          />
                          {link.label}
                        </span>
                        <i
                          className="nav-arrow bi bi-chevron-right"
                          style={{ marginLeft: "auto" }}
                        />
                      </button>

                      {/* Submenu */}
                      <ul
                        className={`nav nav-treeview ${
                          openMenu === link.label ? "show" : ""
                        }`}
                        style={{ gap: "2px", marginLeft: "10px" }}
                      >
                        {link.children.map((child) => (
                          <li
                            key={child.label}
                            className="nav-item"
                            style={{ marginBottom: "2px" }}
                          >
                            <Link href={child.href} className="nav-link">
                              <i className={`nav-icon bi ${child.icon}`} />
                              <p>{child.label}</p>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link href={link.href} className="nav-link">
                      <i className={`nav-icon bi ${link.icon}`} />
                      <p>{link.label}</p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
