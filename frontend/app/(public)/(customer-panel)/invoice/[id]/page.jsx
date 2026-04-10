"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../../customer-dashboard/sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "../../../../components/styles/invoice.css";
import { useAuth } from "../../../../context/AuthContext";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";

export default function InvoiceDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [invoice, setInvoice] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);
  const { token } = useAuth();

  const fetchInvoice = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/customer/getOrderCustomer?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        //console.log("Invoice data:", data.data.orderRow.id);

        setInvoice(data.data.orderRow);
        setOrderHistory(data.data.orderHistory);
      } else {
        console.error("Auth error:", data.message);
      }
    } catch (err) {
      console.error("API error:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    fetchInvoice();
  }, [id]);

  const handlePrint = () => {
    const printContents = document.getElementById("printArea").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };
  const toUpperSafe = (text) => (text ? text.toUpperCase() : "");
  const totalAmount = orderHistory.reduce((sum, order) => {
    return sum + order.qty * order.price;
  }, 0);

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
              <div className="invoice-container" id="printArea">
                {/* start */}
                <div>
                  <h1>INVOICE</h1>

                  

                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Order ID:</strong> {invoice.orderId}
                        </td>
                        <td>
                          <strong>Date:&nbsp;</strong>
                          {invoice.order_date}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          <strong>Shipping Phone:</strong>{" "}
                          {invoice.shipping_phone}
                        </td>
                        <td>
                          <strong>Status:</strong> {invoice.status_name}
                        </td>
                      </tr>

                      <tr>
                        <td colSpan="2">
                          <strong>Payment Method:</strong>&nbsp;
                          {toUpperSafe(invoice?.paymentMethod)}
                          {/* If Bkash then show details */}
                        </td>
                      </tr>

                      {/* SHOW ONLY IF PAYMENT METHOD = BKASH */}
                      {invoice.paymentMethod === "bkash" && (
                        <tr>
                          <td>
                            <strong>Bkash Number:</strong>{" "}
                            {invoice.bkash_number}
                          </td>
                          <td>
                            <strong>Transaction ID:</strong>{" "}
                            {invoice?.transaction_id ?? ""}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <hr />
                  <br />

                  <table className="product-table">
                    <tbody>
                      <tr>
                        <th>Product Name</th>
                        <th className="text-center">Qty</th>
                        <th className="text-center">Unit Price</th>
                        <th className="text-center">Total</th>
                      </tr>

                      {orderHistory.map((order) => (
                        <tr key={order.id}>
                          <td>{order.product_name || ""}</td>
                          <td className="text-center">{order.qty || ""}</td>
                          <td className="text-center">
                            Tk. {order.price || ""}
                          </td>
                          <td className="text-center">
                            Tk. {order.qty * order.price}{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="total-section">
                    <p>
                      <strong>Subtotal:</strong> Tk. {totalAmount}
                    </p>
                    <p>
                      <strong>Shipping:</strong> Tk. {invoice.devliery_charge}
                    </p>
                    <p>
                      <strong>Grand Total:</strong>{" "}
                      <strong>
                        Tk.{" "}
                        {(
                          parseFloat(totalAmount || 0) +
                          parseFloat(invoice.devliery_charge || 0)
                        ).toFixed(2)}
                      </strong>
                    </p>
                  </div>

                  <button className="print-btn" onClick={handlePrint}>
                    Print Invoice
                  </button>
                </div>

                {/* END */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
