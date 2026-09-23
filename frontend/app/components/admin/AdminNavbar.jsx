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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
              </svg>
              Refresh
            </a>
          </li>
           <li className="nav-item d-none d-md-block">
            <a href="/" className="nav-link" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
              </svg>
              Home
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
