// app/components/ClientNavbar.js
"use client"; // Must be top

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import useService from "../../hooks/useServiceSearch";

export default function ClientFooter() {
  const [showScroll, setShowScroll] = useState(false);
  const serviceCategoryId = 3;
  const { settingData } = useService(serviceCategoryId) || {};

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const whatsappNumber = settingData?.whatsApp || "8801915728982";

  return (
    <>
      {/* Fixed WhatsApp Button — desktop only, visible after scroll */}

      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          top: "50%",
          right: "20px",
          transform: showScroll
            ? "translateY(-50%) scale(1)"
            : "translateY(-50%) scale(0)",
          zIndex: 9999,
          backgroundColor: "#25D366",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(37, 211, 102, 0.5)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          opacity: showScroll ? 1 : 0,
        }}
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
      >
        <i
          className="fab fa-whatsapp"
          style={{ fontSize: "30px", color: "#fff", lineHeight: 1 }}
        />
      </a>

      {/* Hide on mobile via global style */}
      <style>{`
        @media (max-width: 767px) {
          .whatsapp-float-btn {
            display: none !important;
          }
        }
        .whatsapp-float-btn:hover {
          box-shadow: 0 6px 28px rgba(37, 211, 102, 0.75) !important;
          transform: translateY(-50%) scale(1.12) !important;
        }
      `}</style>

      <footer className="footer-area app-footer">
        <div className="container">
          <div className="footer-top">
            <div className="row align-items-center justify-content-between">
              <div className="col-xl-6 col-lg-4 col-md-12">
                <a href="home-app.html" className="logo">
                  <Image
                    src="/frontend_theme/images/logo.png"
                    alt="logo"
                    width={150}
                    height={50}
                  />
                </a>
              </div>
              <div className="col-xl-6 col-lg-8 col-md-12">
                <div className="content d-flex justify-content-between align-items-center">
                  <h3>Bring Your Project To Startup Today</h3>
                  <Link href="/contact" className="default-btn app-color">
                    Contact Us <i className="fas fa-chevron-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h3>Contact Details</h3>
                <ul className="footer-contact">
                  <li>
                    <i className="fas fa-map-marker-alt" />{" "}
                    {settingData?.address ||
                      "6065 Hillcroft St, Suite 511, Houston, TX 77081"}
                  </li>
                  <li>
                    <i className="far fa-envelope" />{" "}
                    {settingData?.email || "info@astute360corp.com"}
                  </li>
                  <li>
                    <i className="fas fa-phone-volume" />{" "}
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="number d-flex align-items-center gap-1"
                    >
                      <i className="fab fa-whatsapp text-success" />
                      WhatsApp: {settingData?.whatsApp || "+8801915728982"}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget pl-4">
                <h3>Useful Links</h3>
                <ul className="info-links">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/services">Services</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="single-footer-widget">
                <h3>Company</h3>
                <ul className="info-links">
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/blog">News</Link>
                  </li>
                  <li>
                    <Link href="/about">What we</Link>
                  </li>
                  <li>
                    <Link href="/contact">Help Center</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div
                className="single-footer-widget text-white"
                style={{ textAlign: "justify" }}
              >
                Founded in 2020, FutureGenIT is a forward-thinking technology
                company powered by experienced IT professionals dedicated to
                building scalable, secure, and high-performance digital
                solutions for modern businesses.
              </div>
            </div>
          </div>
        </div>
        <div className="copyright-area">
          <div className="container">
            <p>
              ©{new Date().getFullYear()} FutureGenIT . All Rights Reserved.
            </p>
          </div>
        </div>
        <div className="shape14">
          <img src="/frontend_theme/images/shape14.png" alt="image" />
        </div>
      </footer>
    </>
  );
}
