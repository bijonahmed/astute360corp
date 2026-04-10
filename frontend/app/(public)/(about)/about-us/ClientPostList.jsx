"use client";

import Link from "next/link";
import usePost from "../../../hooks/usePostSearch";

export default function AboutPage({ categoryId }) {
  const { postData } = usePost(categoryId);

  console.log("Post Data categoryId:", categoryId);

  return (
    <div>
      <div className="ps-page--single" id="about-us">
        <img
          loading="lazy"
          src="/frontend_theme/img/bg/about-us.jpg"
          alt="image"
        />
        <div className="ps-about-intro">
          <div className="container">
            <div className="container ps-section__header">
              <h3>{postData.name}</h3>

              <div
                dangerouslySetInnerHTML={{
                  __html: postData.description_full,
                }}
                style={{ textAlign: "justify" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
