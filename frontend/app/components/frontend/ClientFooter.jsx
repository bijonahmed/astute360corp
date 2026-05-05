// app/components/ClientNavbar.js
"use client"; // Must be top

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import useService from "../../hooks/useServiceSearch";
//import "../../components/styles/footer.css";
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
  return (
    <footer className="footer-area app-footer">
      <div className="container">
        <div className="footer-top">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-6 col-lg-4 col-md-12">
              <a href="home-app.html" className="logo">
                <Image
                  src="/frontend_theme/images/white_logo.png"
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
                  {settingData.address ||
                    "6065 Hillcroft St, Suite 511, Houston, TX 77081"}
                </li>
                <li>
                  <i className="far fa-envelope" />{" "}
                  {settingData.email || "info@astute360corp.com"}
                </li>
                <li>
                  <i className="fas fa-phone-volume" />{" "}
                  <a href="tel:+13463283273">
                    {settingData.tel || "+1 (346) 328-3273"}{" "}
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
                  <Link href="/about">What we </Link>
                </li>
                <li>
                  <Link href="/contact">Help Center</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="single-footer-widget">
              <h3>Subscribe</h3>
              <p>Subscribe to receive latest news and freebies</p>
              <form className="newsletter-form" data-toggle="validator">
                <input
                  type="email"
                  className="input-newsletter"
                  placeholder="Enter your email"
                  name="EMAIL"
                  required
                  autoComplete="off"
                />
                <button type="submit">
                  <i className="far fa-paper-plane" />
                </button>
                <div id="validator-newsletter" className="form-result" />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright-area">
        <div className="container">
          <p>©{new Date().getFullYear()} Astute360corp. All Rights Reserved.</p>
        </div>
      </div>
      <div className="shape14">
        <img src="/frontend_theme/images/shape14.png" alt="image" />
      </div>
    </footer>
  );
}
