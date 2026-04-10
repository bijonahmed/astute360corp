"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
export default function AdminNavbar() {
  const { logout, username, roles } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false); // track dropdown

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
   // router.push("/login");
    window.location.href = "/login";
  };
  
const capitalizeFirst = (value) => {
  if (!value) return "";           // null, undefined, or empty
  const str = String(value);       // convert to string if not already
  return str.charAt(0).toUpperCase() + str.slice(1);
};

  return (
    <nav className="app-header navbar navbar-expand bg-body">
      <div className="container-fluid">
        {/* Left side */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
            >
              <i className="bi bi-list" />
            </a>
          </li>
          <li className="nav-item d-none d-md-block">
            <a href="/dashboard" className="nav-link">
              Refresh
            </a>
          </li>
           <li className="nav-item d-none d-md-block">
            <a href="/" className="nav-link" target="_blank">
              e-Commerce 
            </a>
          </li>
        </ul>
        {/* Right side */}
        <ul className="navbar-nav ms-auto">
          {/* User Dropdown */}
          <li
            className={`nav-item dropdown user-menu ${open ? "show" : ""}`}
            onClick={() => setOpen(!open)}
          >
            <a href="#" className="nav-link dropdown-toggle">
              <img
                src="/src/assets/img/user2-160x160.jpg"
                className="user-image rounded-circle shadow"
                alt="User Image"
              />
              <span className="d-none d-md-inline">
                {capitalizeFirst(username)}
              </span>
            </a>
            <ul
              className={`dropdown-menu dropdown-menu-lg dropdown-menu-end ${
                open ? "show" : ""
              }`}
              style={{ right: 0, left: "auto" }}
            >
              {/*begin::User Image*/}
              <li className="user-header text-bg-primary">
                <img
                  src="/src/assets/img/user2-160x160.jpg"
                  className="rounded-circle shadow"
                  alt="User Image"
                />
                <p>
                  {capitalizeFirst(username)}
                  <small>{capitalizeFirst(roles)}</small>
                </p>
              </li>
              <li className="user-footer">
                <Link href="/profile" className="btn btn-default btn-flat">
                  Profile
                </Link>
                <a
                  href="#"
                  className="btn btn-default btn-flat float-end"
                  onClick={handleLogout}
                >
                  Sign out
                </a>
              </li>
              {/*end::Menu Footer*/}
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
}
