"use client";

import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ProductSlider({ images }) {
  const [mainSlider, setMainSlider] = useState(null);
  const [thumbSlider, setThumbSlider] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "center center",
  });

  /* Detect desktop */
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth > 768);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const mainSettings = {
    asNavFor: thumbSlider,
    ref: (slider) => setMainSlider(slider),
    arrows: true,
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  const thumbSettings = {
    asNavFor: mainSlider,
    ref: (slider) => setThumbSlider(slider),
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    focusOnSelect: true,
    arrows: false,
    infinite: true,
  };

  /* Zoom handlers */
  const handleMove = (e) => {
    if (!isDesktop) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      transform: "scale(1.7)",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center center",
    });
  };

  return (
    <div
      className="product-slider-wrapper"
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Left Thumbnail Slider */}
      <div
        className="thumb-slider"
        style={{
          width: "60px",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Slider {...thumbSettings}>
          {images.map((img, index) => (
            <div key={index} style={{ padding: "5px 0" }}>
              <img
                src={img}
                alt={`Thumb ${index + 1}`}
                style={{
                  width: "100%",
                  height: "60px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Main Slider */}
      <div
        className="main-slider"
        style={{
          width: "500px",
          maxWidth: "100%",
          aspectRatio: "1 / 1",
        }}
      >
        <Slider {...mainSettings}>
          {images.map((img, index) => (
            <div key={index}>
              <div
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  border: "1px solid #ddd",      // ✅ BORDER
                  borderRadius: "4px",
                  cursor: isDesktop ? "zoom-in" : "default",
                }}
              >
                <img
                  src={img}
                  alt={`Product ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    cursor: isDesktop ? "zoom-out" : "default",
                    ...zoomStyle,
                  }}
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style jsx>{`
        /* Desktop: hide scrollbars in thumbnails */
        .thumb-slider .slick-list {
          overflow: hidden !important;
        }

        /* Mobile: keep design clean */
        @media (max-width: 480px) {
          .product-slider-wrapper {
            flex-direction: column;
          }

          .thumb-slider {
            display: none !important;
          }

          .main-slider {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
