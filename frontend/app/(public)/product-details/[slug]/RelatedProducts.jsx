"use client";

import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function RelatedProducts({ products = [] }) {
  const router = useRouter();
  const [slidesToShow, setSlidesToShow] = useState(6); // desktop default

  // Detect screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setSlidesToShow(1); // mobile default
      } else {
        setSlidesToShow(6); // desktop default
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleVendorClick = (slug) => {
    router.push(`/product-details/${slug}`);
  };

  const arrowStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 10,
    fontSize: "24px",
    color: "#333",
    cursor: "pointer",
    background: "#fff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  };

  function NextArrow({ onClick }) {
    return (
      <div style={{ ...arrowStyle, right: "-50px" }} onClick={onClick}>
        <i className="icon-chevron-right"></i>
      </div>
    );
  }

  function PrevArrow({ onClick }) {
    return (
      <div style={{ ...arrowStyle, left: "-50px" }} onClick={onClick}>
        <i className="icon-chevron-left"></i>
      </div>
    );
  }

  const settings = {
    slidesToShow,
    slidesToScroll: 1,
    infinite: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dots: false,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: Math.min(5, products.length) } },
      { breakpoint: 1200, settings: { slidesToShow: Math.min(4, products.length) } },
      { breakpoint: 992, settings: { slidesToShow: Math.min(3, products.length) } },
      { breakpoint: 576, settings: { slidesToShow: Math.min(2, products.length) } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }, // mobile
    ],
  };

  return (
    <div style={{ position: "relative", padding: "20px 60px" }}>
      <h3 style={{ marginBottom: "15px" }}>Related Products</h3>

      {products.length > 0 && (
        <Slider {...settings} className="related-slider">
          {products.map((product, index) => (
            <div
              key={index}
              className="custom-slide"
              style={{
              padding: "0 8px", 
                boxSizing: "border-box",
              }} >
              <div style={{ position: "relative" }}>
                <Link
                  href={`/product-details/${product.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleVendorClick(product.slug);
                  }}
                >
                  <img
                    src={product.thumbnail_image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                        padding: '5px',
                      borderRadius: "5px",
                    }}
                  />
                </Link>
              </div>

              <div>
                <Link
                  href={`/product-details/${product.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleVendorClick(product.slug);
                  }}
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#999",
                    margin: "5px 0",
                  }}
                >
                  {product.vendor}
                </Link>

                <Link
                  href={`/product-details/${product.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleVendorClick(product.slug);
                  }}
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "5px",
                  }}
                >
                  {product.name}
                </Link>

                <p style={{ fontWeight: "bold", margin: 0 }}>
                  TK. {product.discount_price}{" "}
                  {product.price && (
                    <del style={{ marginLeft: "5px", color: "#999" }}>
                      TK.{product.price}
                    </del>
                  )}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}

      {/* Mobile 1 slide fix */}
      <style jsx>{`
        @media (max-width: 480px) {
          .related-slider .slick-slide {
            display: flex !important;
            justify-content: center;
            width: 100% !important;
            margin: 0 !important;
          }
          .related-slider .slick-track {
            display: flex !important;
            flex-wrap: nowrap !important;
          }
          .related-slider .slick-list {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
