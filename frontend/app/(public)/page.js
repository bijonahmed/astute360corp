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
    return postData.slice(-6).reverse(); // last 6 + newest first
  }, [postData]);
  const [pageLoading, setPageLoading] = useState(false);
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
        <div className="app-banner-area d-none">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="app-banner-content space-y-5">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                    Your Trusted Technology Solutions Provider{" "}
                    <span className="text-blue-600">FutureGenIT</span>
                  </h1>
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

        <Slider />
        {/* End Banner Area */}
        {/* Start About Area */}
        <div
          className="about-area"
          style={{
            padding: "clamp(10px, 8vw, 50px) 15px",
            background: "#3e6cb712", // ✅ clean transparent
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {/* Card */}
            <div
              style={{
                background: "#ffffffb5",
                borderRadius: "20px",
                padding: "clamp(20px, 5vw, 50px)",
                border: "1px solid #eef2ff",
              }}
            >
              {/* Title */}
              <h2
                style={{
                  fontSize: "clamp(22px, 4vw, 34px)", // ✅ responsive font
                  fontWeight: "800",
                  marginBottom: "20px",
                  color: "#111827",
                  lineHeight: "1.3",
                }}
              >
                FutureGenIT – Trusted Global IT Partner for Startups &
                Enterprises
              </h2>

              {/* Paragraph */}
              <p
                style={{
                  textAlign: "justify",
                  color: "#4b5563",
                  lineHeight: "1.8",
                  fontSize: "clamp(14px, 2.5vw, 16px)", // ✅ responsive text
                }}
              >
                <strong>
                  Founded in 2020, FutureGenIT is a forward-thinking technology
                  company powered by experienced IT professionals dedicated to
                  building scalable, secure, and high-performance digital
                  solutions.
                </strong>
              </p>

              <p
                style={{
                  textAlign: "justify",
                  color: "#6b7280",
                  lineHeight: "1.8",
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                }}
              >
                We help startups, SMEs, and enterprises transform ideas into
                powerful digital products through software development, IT
                consulting, and scalable architecture solutions.
              </p>

              {/* Features Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", // ✅ responsive fix
                  gap: "12px",
                  marginTop: "30px",
                }}
              >
                {[
                  "End-to-End Software Development",
                  "Web, Mobile & SaaS Development",
                  "IT Staff Augmentation",
                  "Cloud & DevOps Solutions",
                  "API & Integration Services",
                  "Enterprise Systems",
                  "AI & Automation",
                  "Global Clients",
                  "24/7 Support",
                  "Scalable Cloud Architecture",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#f9fafb",
                      padding: "12px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "clamp(13px, 2.2vw, 14px)",
                    }}
                  >
                    <span style={{ color: "#2563eb" }}>✔</span>
                    {item}
                  </div>
                ))}
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
                <div className="features-box text-center p-4">
                  <svg
                    width="50"
                    height="50"
                    fill="none"
                    stroke="#0d6efd"
                    strokeWidth="2"
                    className="mb-3"
                  >
                    <circle cx="18" cy="20" r="6" />
                    <circle cx="32" cy="20" r="6" />
                    <path d="M10 40c2-6 8-8 16-8s14 2 16 8" />
                  </svg>

                  <h3 className="h5 fw-bold">AI & Smart Automation</h3>

                  <p className="text-muted">
                    FutureGenIT delivers AI-powered solutions and intelligent
                    automation systems that help businesses improve efficiency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Features Area */}
        {/* Start App Screenshot Area */}

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
                    “FutureGenIT helped our startup streamline operations and
                    build a scalable software system. Their technical expertise
                    and support played a key role in our rapid growth.”
                  </p>

                  <div className="info d-flex align-items-center justify-content-center">
                    <div className="title">
                      <h3>Daniel Carter</h3>
                      <span>Founder, SaaS Startup</span>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="testimonials-item">
                  <i className="icon flaticon-quotation" />

                  <p>
                    “Working with FutureGenIT was a great experience. Their web
                    and mobile application development significantly improved
                    our customer engagement and business performance.”
                  </p>

                  <div className="info d-flex align-items-center justify-content-center">
                    <div className="title">
                      <h3>Emily Roberts</h3>
                      <span>CEO, E-Commerce Platform</span>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="testimonials-item">
                  <i className="icon flaticon-quotation" />

                  <p>
                    “FutureGenIT’s IT consulting and staff augmentation services
                    helped us scale our engineering team efficiently. They are
                    professional, reliable, and highly skilled technology
                    partners.”
                  </p>

                  <div className="info d-flex align-items-center justify-content-center">
                    <div className="title">
                      <h3>Michael Anderson</h3>
                      <span>CTO, FinTech Company</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Testimonials Area */}
        {/* Start App Download Area */}

        {/* End App Download Area */}
        {/* Start Blog Area */}
        <div className="blog-area pt-10 pb-70">
          <div className="container">
            <div className="section-title">
              <h2>Our Latest News</h2>
              <p>
                Stay updated with the latest insights, innovations, and
                technology trends from FutureGenIT. Discover how modern software
                solutions, cloud systems, and digital transformation are helping
                businesses grow and stay competitive in a fast-changing digital
                world.
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
                          {/* <li>
                            <i className="far fa-calendar-alt" />{" "}
                            {post.createdAt}
                          </li> */}
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
