"use client";

import { useEffect, useState, use, useMemo } from "react";
import Link from "next/link";
import ClientNavbar from "../../../components/frontend/ClientNavbar";
import ClientFooter from "../../../components/frontend/ClientFooter";

export default function BlogPage({ params }) {
  const { slug } = use(params); // Next.js 15 fix

  const [data, setData] = useState(null);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ SEARCH STATE (NEW)
  const [searchTerm, setSearchTerm] = useState("");

  // FETCH BLOG
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/public/checkedProductRow/${slug}`,
        { cache: "no-store" }
      );
      const result = await res.json();
      setData(result.data || null);
    } catch (error) {
      console.error("Blog fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // FETCH POPULAR POSTS
  const fetchPopular = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/public/getsAllServices`,
        { cache: "no-store" }
      );
      const result = await res.json();
      setPopularPosts(result.data || []);
    } catch (error) {
      console.error("Popular posts error:", error);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
      fetchPopular();
    }
  }, [slug]);

  // ✅ FILTERED POSTS (NEW SEARCH LOGIC)
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return popularPosts;

    return popularPosts.filter((post) =>
      post.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [popularPosts, searchTerm]);

  return (
    <>
      {/* Page Title */}
      <div className="page-title-area style-four bg4">
        <div className="container">
          <div className="page-title-content text-start">
            <h2>{data?.title || "Blog Details"}</h2>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>Service Details</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Blog Details */}
      <section className="blog-details-area ptb-100">
        <div className="container">
          {loading && <p>Loading...</p>}

          {!loading && data && (
            <div className="row">
              {/* LEFT CONTENT */}
              <div className="col-lg-8 col-md-12">
                <div className="blog-details-desc">
                  <div className="article-image">
                    <img
                      src={data.image || "/frontend_theme/blog/blog-img4.jpg"}
                      alt={data.name}
                    />
                  </div>

                  <div className="article-content" style={{ color: "#000" }}>
                    <div className="entry-meta mb-3">
                      <ul
                        style={{
                          display: "flex",
                          gap: "20px",
                          padding: 0,
                          listStyle: "none",
                          fontSize: "14px",
                          color: "#555",
                        }}
                      >
                        <li>
                          <i className="far fa-user-circle" />{" "}
                          <span>{data.author || "Admin"}</span>
                        </li>

                        <li>
                          <i className="far fa-calendar-alt" />{" "}
                          <time dateTime={data.created_at}>
                            {data.created_at}
                          </time>
                        </li>
                      </ul>
                    </div>

                    <h1
                      style={{
                        fontSize: "28px",
                        fontWeight: "700",
                        marginBottom: "15px",
                      }}
                    >
                      {data.title}
                    </h1>

                    <hr style={{ margin: "25px 0", opacity: 0.2 }} />

                    <div
                      className="blog-content-body"
                      dangerouslySetInnerHTML={{
                        __html: data.description,
                      }}
                      style={{
                        fontSize: "16px",
                        lineHeight: "1.9",
                        color: "#111",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="col-lg-4 col-md-12">
                <aside className="widget-area extra-padding">

                  {/* SEARCH (ACTIVE) */}
                  <div className="widget widget_search">
                    <form
                      className="search-form"
                      onSubmit={(e) => e.preventDefault()}
                    >
                      <input
                        type="search"
                        className="search-field"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          outline: "none",
                        }}
                      />
                      <button type="submit">
                        <i className="fas fa-search" />
                      </button>
                    </form>
                  </div>

                  {/* POPULAR POSTS (FILTERED) */}
                  <div className="widget widget_noke_posts_thumb">
                    <h3 className="widget-title">Popular Posts</h3>

                    {filteredPosts.length === 0 && (
                      <p>No posts found</p>
                    )}

                    {filteredPosts.map((post) => (
                      <article
                        className="item"
                        key={post.id}
                        style={{
                          paddingBottom: "20px",
                          marginBottom: "20px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <Link href={`/services/${post.slug}`} className="thumb">
                          <img
                            src={post.thumnail_img}
                            alt={post.name}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </Link>

                        <div
                          style={{
                            fontWeight: "400",
                            marginTop: "8px",
                          }}
                        >
                          <Link
                            href={`/services/${post.slug}`}
                            style={{
                              fontWeight: "400",
                              color: "#000",
                              textDecoration: "none",
                              fontSize: "14px",
                              lineHeight: "1.4",
                            }}
                          >
                            {post.name}
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>

                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}