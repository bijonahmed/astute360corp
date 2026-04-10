"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import useDashboardLogic from "../../hooks/dashboardLogic";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token, permissions } = useAuth();
  const { dashbaordData } = useDashboardLogic();

  useEffect(() => {
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
        if (res.ok) {
          setUser(data);
        } else {
          console.error("Auth error:", data.message);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return <p className="text-center py-5"></p>;
  }

  return (
    <>
      <main className="app-main">
        {/*begin::App Content Header {user.name}*/}
        {/*begin::App Content*/}
        <div className="app-content mt-3">
          {/*begin::Container*/}
          <div className="container-fluid">
            {/*begin::Row*/}
            <div className="row">
              {/*begin::Col*/}
              {/*end::Col*/}
              <div className="col-lg-2 col-6">
                {/*begin::Small Box Widget 2*/}
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>{dashbaordData.product_catgory}</h3>
                    <p>Product Category</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                  <Link
                    href="/product-categories-manage"
                    className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg" />
                  </Link>
                </div>
                {/*end::Small Box Widget 2*/}
              </div>
              {/*end::Col*/}

              {/*end::Col*/}
              
              {/*end::Col*/}
              <div className="col-lg-2 col-6 d-none">
                {/*begin::Small Box Widget 3*/}
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>{dashbaordData.customer}</h3>
                    <p>Total Customer</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                  </svg>
                  <Link
                    href="/customer"
                    className="small-box-footer link-dark link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg" />
                  </Link>
                </div>
                {/*end::Small Box Widget 3*/}
              </div>
              {/*end::Col*/}
              <div className="col-lg-2 col-6 d-none">
                {/*begin::Small Box Widget 4*/}
                <div className="small-box text-bg-danger">
                  <div className="inner">
                    <h3>{dashbaordData.supplier}</h3>
                    <p>All Supplier</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
                    />
                    <path
                      clipRule="evenodd"
                      fillRule="evenodd"
                      d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
                    />
                  </svg>
                  <Link
                    href="/supplier"
                    className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg" />
                  </Link>
                </div>
                {/*end::Small Box Widget 4*/}
              </div>
              {/*end::Col*/}
              <div className="col-lg-2 col-6 d-none">
                {/*begin::Small Box Widget 2*/}
                <div className="small-box text-bg-warning">
                  <div className="inner">
                    <h3>{dashbaordData.purchase}</h3>
                    <p>Purchase Mangement</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                  <Link
                    href="/purchase"
                    className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg" />
                  </Link>
                </div>
                {/*end::Small Box Widget 2*/}
              </div>

              <div className="col-lg-2 col-6">
                {/*begin::Small Box Widget 3*/}
                <div className="small-box text-bg-success">
                  <div className="inner">
                    <h3>{dashbaordData.products}</h3>
                    <p>Total Products</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
                  </svg>
                  <Link
                    href="/product"
                    className="small-box-footer link-dark link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg" />
                  </Link>
                </div>
                {/*end::Small Box Widget 3*/}
              </div>
              {/*end::Col*/}
              <div className="col-lg-2 col-6 d-none">
                {/*begin::Small Box Widget 2*/}
                <div className="small-box text-bg-danger">
                  <div className="inner">
                    <h3>{dashbaordData.pendingOrders}</h3>
                    <p>Total Pending Orders</p>
                  </div>
                  <svg
                    className="small-box-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                  <Link
                    href="/order"
                    className="small-box-footer link-light link-underline-opacity-0 link-underline-opacity-50-hover"
                  >
                    More info <i className="bi bi-link-45deg" />
                  </Link>
                </div>
                {/*end::Small Box Widget 2*/}
              </div>
            </div>
            {/*end::Row*/}
            {/*begin::Row*/}

            {/* /.row (main row) */}
          </div>
          {/*end::Container*/}
        </div>
        {/*end::App Content*/}
      </main>
    </>
  );
}
