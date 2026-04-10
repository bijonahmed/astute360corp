// app/components/ClientNavbar.js
"use client"; // Must be top

import Link from "next/link";
import useCategoriesParent from "../../hooks/useCategoriesParent";

export default function PromotionProducts() {
  const { categoryParentData, loading } = useCategoriesParent();

  return (
    <div className="ps-promotions mt-3">
      <div className="container">
        {/* Start */}

        <div className="ps-section__content">
          <div className="ps-section__column">
            <div className="row justify-content-center g-2">
              {categoryParentData.map((category, index) => (
                <div
                  key={index}
                  className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6"
                >
                  <div
                    className="ps-block--category"
                    style={{
                      position: "relative",
                      height: "205px",
                      width: "100%",
                      borderRadius: "6px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                  >
                    <Link href={`/product-categories/${category.slug}`}>
                      <img
                        loading="lazy"
                        src={category.thumbnail_image}
                        alt={category.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />

                      {/* Centered Text Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          color: "#fff",
                          fontWeight: "700",
                          fontSize: "16px",
                          textAlign: "center",
                          textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                          padding: "0 6px",
                          pointerEvents: "none",
                        }}
                      >
                        {category.name}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* END */}
      </div>
    </div>
  );
}
