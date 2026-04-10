"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import Slider from "../components/frontend/Slider";
import usePost from "../hooks/useBlogPostSearch";
export default function Home() {
  const { posts } = usePost();
  const categoryId = 7;
  const { postData = [], loading } = usePost(categoryId);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(postData.length / postsPerPage);
  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return postData.slice(start, start + postsPerPage);
  }, [postData, currentPage]);
  const [pageLoading, setPageLoading] = useState(false);
  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
      //window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400); // smooth loader delay
  };
  useEffect(() => {
    // Dynamically load jQuery + Owl Carousel only on client
    const loadOwlCarousel = async () => {
      if (typeof window !== "undefined") {
        const $ = (await import("jquery")).default;
        window.$ = window.jQuery = $;
        await import("owl.carousel/dist/owl.carousel.min.js");
        // Initialize partner slider
        $(".partner-slides").owlCarousel({
          loop: true,
          margin: 20,
          nav: false,
          dots: false,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          responsive: {
            0: { items: 2 },
            576: { items: 3 },
            768: { items: 4 },
            1200: { items: 5 },
          },
        });
        // Initialize testimonials slider
        $(".testimonials-slides").owlCarousel({
          loop: true,
          margin: 30,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 5000,
          autoplayHoverPause: true,
          responsive: {
            0: { items: 1 },
            768: { items: 1 },
          },
        });
      }
    };
    loadOwlCarousel();
    // Cleanup on unmount
    return () => {
      if (typeof window !== "undefined" && window.$) {
        const $ = window.$;
        if ($(".partner-slides").data("owl.carousel")) {
          $(".partner-slides").trigger("destroy.owl.carousel");
        }
        if ($(".testimonials-slides").data("owl.carousel")) {
          $(".testimonials-slides").trigger("destroy.owl.carousel");
        }
      }
    };
  }, []);
  return (
    <>
      <div>
        {/* Start Banner Area */}
        <div className="app-banner-area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="app-banner-content">
                  <h1>Your trusted technology solutions provider </h1>
                  <p>
                    The goal of IT services is to provide efficient and
                    effective technology solutions that help businesses achieve
                    their objectives.
                  </p>
                  <div className="btn-box">
                    <a href="#" className="store-btn">
                      <img
                        src="/frontend_theme/images/play-store.png"
                        alt="image"
                      />
                      Download on
                      <span>Our Mobile Apps</span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="app-banner-image">
                  <img
                    src="/frontend_theme/images/app-banner.png"
                    alt="image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Banner Area */}
        {/* Start About Area */}
        <div className="about-area ptb-100">
          <div className="container">
            <div className="section-title">
              <h2>About Us</h2>
              <p>
                We provide perfect IT solutions & technology for any startups.
              </p>
            </div>
            <div className="row align-items-center">
              {/* Left Content */}
              <div className="col-lg-6 col-md-12">
                <div className="app-about-content">
                  <h3>Trusted IT Partner for Startups & Enterprises</h3>
                  <p>
                    <strong>
                      Founded in 2019, managed by professionals from an IT
                      background with years of industry experience.
                    </strong>
                  </p>
                  <p>
                    We offer technology consulting and staff augmentation
                    services, with an operational presence in the United States.
                    Our expertise spans across diverse IT domains, making us a
                    preferred choice among several U.S.-based clients.
                  </p>
                  <ul className="features-list">
                    <li>
                      <i className="fas fa-check-circle" /> Technology
                      Consulting Services
                    </li>
                    <li>
                      <i className="fas fa-check-circle" /> Staff Augmentation
                      Solutions
                    </li>
                    <li>
                      <i className="fas fa-check-circle" /> Trusted by
                      U.S.-based Clients
                    </li>
                  </ul>
                  <Link href="/about" className="default-btn app-color">
                    Learn More <i className="fas fa-chevron-right" />
                  </Link>
                </div>
              </div>
              {/* Right Image */}
              <div className="col-lg-6 col-md-12">
                <div className="app-about-image">
                  <img
                    src="/frontend_theme/images/about-img4.png"
                    alt="About IT Solutions"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End About Area */}
        {/* Start Features Area */}
        <div className="features-area pb-70">
          <div className="container">
            <div className="section-title">
              <h2>Our Best Service</h2>
              <p>
                We deliver smart IT solutions tailored to your business growth
                and digital transformation needs.
              </p>
            </div>
            <div className="row justify-content-center">
              {/* Software Development */}
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-box text-center">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#7669ff"
                    strokeWidth="2"
                  >
                    <path d="M16 18l-6 6 6 6M32 18l6 6-6 6" />
                  </svg>
                  <h3>Software Development</h3>
                  <p>
                    Build secure, scalable, and custom software tailored to your
                    business needs using modern technologies and best practices.
                  </p>
                </div>
              </div>
              {/* Web Development */}
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-box text-center">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#ff9f07"
                    strokeWidth="2"
                  >
                    <rect x="5" y="10" width="40" height="25" rx="3" />
                    <line x1="5" y1="15" x2="45" y2="15" />
                  </svg>
                  <h3>Web Development</h3>
                  <p>
                    Create fast, responsive, and SEO-friendly websites that
                    deliver excellent performance across all devices and
                    platforms.
                  </p>
                </div>
              </div>
              {/* Mobile App */}
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-box text-center">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#89c111"
                    strokeWidth="2"
                  >
                    <rect x="12" y="5" width="26" height="40" rx="4" />
                    <circle cx="25" cy="38" r="2" />
                  </svg>
                  <h3>Mobile App Development</h3>
                  <p>
                    Develop high-performance Android and iOS apps with smooth
                    user experience and modern design standards.
                  </p>
                </div>
              </div>
              {/* Digital Marketing */}
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-box text-center">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#2ea7ff"
                    strokeWidth="2"
                  >
                    <circle cx="25" cy="25" r="20" />
                    <path d="M25 5v40M5 25h40" />
                  </svg>
                  <h3>Digital Marketing</h3>
                  <p>
                    Increase brand visibility with SEO, social media strategies,
                    and data-driven marketing campaigns to drive traffic, leads,
                    conversions growth success.
                  </p>
                </div>
              </div>
              {/* Consulting */}
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-box text-center">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#ca83ff"
                    strokeWidth="2"
                  >
                    <path d="M10 40l15-30 15 30H10z" />
                  </svg>
                  <h3>Consulting</h3>
                  <p>
                    Get expert IT consulting to choose the right technologies,
                    improve processes, and drive business success.
                  </p>
                </div>
              </div>
              {/* Consulting to Permanent */}
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="features-box text-center">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#ff5f5f"
                    strokeWidth="2"
                  >
                    <circle cx="18" cy="20" r="6" />
                    <circle cx="32" cy="20" r="6" />
                    <path d="M10 40c2-6 8-8 16-8s14 2 16 8" />
                  </svg>
                  <h3>Consulting to Permanent</h3>
                  <p>
                    Flexible hiring model that allows you to evaluate
                    consultants and convert them into full-time employees
                    easily.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Features Area */}
        {/* Start App Screenshot Area */}
        <div
          className="partner-area ptb-80 mb-5"
          style={{ background: "#f9f9f9" }}
        >
          <div className="container">
            <h3 className="text-center mb-2">Our Clients</h3>
            <div className="partner-slides owl-carousel owl-theme">
              {/* Item 1 */}
              <div className="partner-item text-center">
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fff",
                    margin: "10px",
                  }}
                >
                  <img
                    src="/frontend_theme/images/client/acc_logo_black_purple_rgb.png"
                    alt="client"
                    style={{
                      width: "100%",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              {/* Item 2 */}
              <div className="partner-item text-center">
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fff",
                    margin: "10px",
                  }}
                >
                  <img
                    src="/frontend_theme/images/client/cog_logo.png"
                    alt="client"
                    style={{
                      width: "100%",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              {/* Item 3 */}
              <div className="partner-item text-center">
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fff",
                    margin: "10px",
                  }}
                >
                  <img
                    src="/frontend_theme/images/client/emergent-logo-header.png"
                    alt="client"
                    style={{
                      width: "100%",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              {/* Item 4 */}
              <div className="partner-item text-center">
                <div
                  style={{
                    border: "1px solid #eee",
                    borderRadius: "10px",
                    padding: "20px",
                    background: "#fff",
                    margin: "10px",
                  }}
                >
                  <img
                    src="/frontend_theme/images/client/radient-inc.png"
                    alt="client"
                    style={{
                      width: "100%",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End App Screenshot Area */}
        {/* Start Pricing Area */}
        {/* End Pricing Area */}
        {/* Start Testimonials Area */}
        <div className="testimonials-area pb-100">
          <div className="container">
            <div className="testimonials-inner ptb-100 bg-app-image">
              <div className="testimonials-slides owl-carousel owl-theme">
                {/* Review 1 */}
                <div className="testimonials-item">
                  <i className="icon flaticon-quotation" />
                  <p>
                    “Astute360corp IT Solutions helped our startup optimize IT
                    operations and implement robust software solutions. Their
                    expertise ensures scalable growth.”
                  </p>
                  <div className="info d-flex align-items-center justify-content-center">
                    <div className="title">
                      <h3>Allan Morris</h3>
                      <span>Director, Tech Startup</span>
                    </div>
                  </div>
                </div>
                {/* Review 2 */}
                <div className="testimonials-item">
                  <i className="icon flaticon-quotation" />
                  <p>
                    “Working with Astute360corp was seamless. Their web and
                    mobile app development significantly improved our client
                    engagement and business efficiency.”
                  </p>
                  <div className="info d-flex align-items-center justify-content-center">
                    <div className="title">
                      <h3>Sarah Taylor</h3>
                      <span>CEO, E-Commerce Firm</span>
                    </div>
                  </div>
                </div>
                {/* Review 3 */}
                <div className="testimonials-item">
                  <i className="icon flaticon-quotation" />
                  <p>
                    “Astute360corp’s technology consulting and staff
                    augmentation empowered our team to scale efficiently.
                    Professional, knowledgeable, and reliable IT partners.”
                  </p>
                  <div className="info d-flex align-items-center justify-content-center">
                    <div className="title">
                      <h3>Michael Johnson</h3>
                      <span>CTO, Finance Company</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Testimonials Area */}
        {/* Start App Download Area */}
        <div className="app-download-area pt-100">
          <div className="container">
            <div className="row align-items-center">
              {/* Image Section */}
              <div className="col-lg-6 col-md-12">
                <div className="app-download-image">
                  <img
                    src="/frontend_theme/images/app-download.png"
                    alt="Astute360corp Mobile App"
                  />
                </div>
              </div>
              {/* Content Section */}
              <div className="col-lg-6 col-md-12">
                <div className="app-download-content">
                  <span className="sub-title">DOWNLOAD APP</span>
                  <h2>Stay Connected With Astute360corp On The Go</h2>
                  <p>
                    Our mobile app lets you manage IT solutions, track projects,
                    and access consulting services anytime, anywhere. Designed
                    for startups and businesses seeking reliable technology
                    support.
                  </p>
                  <div className="btn-box">
                    <a href="#" className="store-btn">
                      <img
                        src="/frontend_theme/images/play-store.png"
                        alt="Download Astute360corp App"
                      />
                      Download on
                      <span>Our Apps</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End App Download Area */}
        {/* Start Blog Area */}
        <div className="blog-area pt-100 pb-70">
          <div className="container">
            <div className="section-title">
              <h2>Our Latest News</h2>
              <p>
                Stay updated with the latest insights, trends, and tips from
                Astute360corp IT Solutions. Explore how technology is
                transforming businesses.
              </p>
            </div>
            <div className="row justify-content-center">
              {loading || pageLoading ? (
                <div className="text-center py-5">
                  <p>Loading...</p>
                </div>
              ) : currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <div className="col-lg-4 col-md-6 d-flex mb-4" key={post.id}>
                    <div
                      className="single-post-item startup-color"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      {/* Image */}
                      <div className="post-image">
                        <Link href={`/blog/${post.slug}`} className="d-block">
                          <img
                            src={
                              post.thumnail_img ||
                              "/frontend_theme/blog/default.jpg"
                            }
                            alt={post.name}
                            style={{
                              width: "100%",
                              height: "220px",
                              objectFit: "cover",
                            }}
                          />
                        </Link>
                      </div>
                      {/* Content */}
                      <div
                        className="post-content"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                          padding: "15px",
                        }}
                      >
                        <ul className="meta">
                          <li>
                            <i className="far fa-calendar-alt" />{" "}
                            {post.createdAt}
                          </li>
                          <li>
                            <i className="far fa-user-circle" /> {post.vendor}
                          </li>
                        </ul>
                        <h3 style={{ minHeight: "50px" }}>
                          <Link href={`/blog/${post.slug}`}>{post.name}</Link>
                        </h3>
                        <p style={{ minHeight: "60px" }}>
                          {post.description_full
                            ?.replace(/<[^>]+>/g, "")
                            .substring(0, 100)}
                          ...
                        </p>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="link-btn"
                          style={{ marginTop: "auto" }}
                        >
                          Read More <i className="fas fa-chevron-right" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <p>No blog posts found</p>
                </div>
              )}
              {/* ✅ Pagination */}
              {totalPages > 1 && (
                <div className="col-lg-12">
                  <div className="pagination-area text-center">
                    {/* Prev */}
                    <button
                      className="page-numbers"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      ‹
                    </button>
                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`page-numbers ${
                            currentPage === page ? "current" : ""
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {/* Next */}
                    <button
                      className="page-numbers"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* End Blog Area */}
        {/* Start Footer Area */}
        {/* End Footer Area */}
        <div className="go-top app-color">
          <i className="fas fa-chevron-up" />
        </div>
        {/* Start QuickView Modal Area */}
        {/* End QuickView Modal Area */}
      </div>
    </>
  );
}
