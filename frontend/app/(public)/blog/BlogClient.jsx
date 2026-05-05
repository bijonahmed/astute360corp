"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import usePost from "../../hooks/useBlogPostSearch";

export default function BlogPage() {
  const categoryId = 7;
  const { postData = [], loading } = usePost(categoryId);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // ✅ Calculate pages
  const totalPages = Math.ceil(postData.length / postsPerPage);

  // ✅ Get current page data
  const currentPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return postData.slice(start, start + postsPerPage);
  }, [postData, currentPage]);

  // ✅ Handle page change with loader effect
  const [pageLoading, setPageLoading] = useState(false);

  const handlePageChange = (page) => {
    if (page === currentPage) return;

    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setPageLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 400); // smooth loader delay
  };

  return (
    <>
      <div>
        {/* Page Title */}
        <div className="page-title-area transparent-bg1">
          <div className="container">
            <div className="page-title-content text-start">
              <h2>Blog</h2>
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>Blog</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Blog Area */}
        <div className="blog-area ptb-100">
          <div className="container">
            <div className="section-title">
              <span className="sub-title">NEWS & ARTICLES</span>
              <h2>Learn More From Our Latest Blog</h2>
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
      </div>

    </>
  );
}
