"use client"; // required for client components
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // Adjust the path as necessary
import Sidebar from "../customer-dashboard/sidebar";
import useOrderList from "../../../hooks/getOrderCustomer";

import { useEffect, useState } from "react";

export default function InvoicePage() {
  const { token, login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { orderData } = useOrderList();

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
  }, []);

  useEffect(() => {
    const base = "Customer Invoice List";

    document.title = base;
  }, []);

  const toUpperSafe = (text) => (text ? text.toUpperCase() : "");

  return (
    <main className="ps-page--my-account">
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/customer-dashboard">Account</Link>
            </li>
            <li>Invoices</li>
          </ul>
        </div>
      </div>
      <section className="ps-section--account">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="ps-section__left">
                <Sidebar />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="ps-section__right">
                <div className="ps-section--account-setting">
                  <div className="ps-section__header">
                    <h3>Invoices</h3>
                  </div>
                  <div className="ps-section__content">
                    <div className="table-responsive">
                      <table className="table ps-table ps-table--invoices">
                        <thead>
                          <tr>
                            <th>OrderID</th>
                            <th>Order Date</th>
                            <th>Payment Method</th>
                            <th>Shipping Phone</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderData.map((order) => (
                            <tr key={order.id}>
                              <td>
                                <Link href={`/invoice/${order.id}`}>
                                  {order.orderId}
                                </Link>
                              </td>
                              <td>{order.order_date}</td>
                              <td className="text-center">
                                {toUpperSafe(order?.paymentMethod)}
                              </td>
                              <td>
                                <Link href={`/invoice/${order.id}`}>
                                  {order.shipping_phone}
                                </Link>
                              </td>

                              <td>Tk.{order.subtotal}</td>
                              <td>{order.status_name}</td>
                              <td>
                                <Link
                                  href={`/invoice/${order.id}`}
                                  className="btn btn-warning btn-lg text-white fw-semibold"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
