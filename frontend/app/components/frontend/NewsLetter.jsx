// app/components/ClientNavbar.js
"use client"; // Must be top

import Link from "next/link";
import useProducts from "../../hooks/getProducts";

export default function NewsLetter() {
  const { products, loading, hasMore, loadMore } = useProducts(8);

  return (
    <div className="ps-top-categories">
      <div className="container">
        <h3>New Arrivals</h3>
        {/* <pre>{JSON.stringify(products, null, 2)}</pre> */}
        <div className="row">
          {products?.map((product) => (
            <div
              key={product.id}
              className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6"
            >
              <Link
                href={`/product-details/${product.slug}`}
                className="text-decoration-none"
              >
                <div
                  className="ps-block--category"
                  data-mh="categories"
                  style={{ height: "231.567px", cursor: "pointer" }}
                >
                  <div className="ps-block__thumbnail">
                    <img
                      loading="lazy"
                      src={product.thumnail_img}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="ps-block__content text-center">
                    <p title={product.name} className="text-dark">
                      {product.name.length > 20
                        ? product.name.slice(0, 20) + "..."
                        : product.name}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
