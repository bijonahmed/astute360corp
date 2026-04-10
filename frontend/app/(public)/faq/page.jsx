"use client";
import { useState } from "react";
import Link from "next/link";
import ClientNavbar from "../../components/frontend/ClientNavbar";
import ClientFooter from "../../components/frontend/ClientFooter";

export default function FaqPage() {
  const [active, setActive] = useState(null);

  const toggle = (index) => {
    setActive(active === index ? null : index);
  };

  const faqs = [
    {
      q: "What Is The Design Process For Branding?",
      a: "The branding design process involves understanding your business, audience, and goals, followed by brainstorming, concept creation, and refinement. It includes logo design, typography, color schemes, and brand guidelines."
    },
    {
      q: "How Much Does Logo Design Services Cost?",
      a: "Logo design costs vary based on complexity, designer expertise, and project requirements. Prices can range from affordable options for startups to premium services."
    },
    {
      q: "What Is Included In A Round Of Revisions?",
      a: "A revision round typically includes updates based on your feedback such as color adjustments, layout changes, or font tweaks."
    },
    {
      q: "How Long Does A Project Take?",
      a: "Project timelines depend on complexity, but most branding projects take between 1–4 weeks from concept to final delivery."
    }
  ];

  return (
    <>
      <ClientNavbar />

      {/* Page Title */}
      <div className="page-title-area transparent-bg1">
        <div className="container">
          <div className="page-title-content text-start">
            <h2>FAQ</h2>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-area ptb-100" style={{ background: "linear-gradient(135deg, #f5f7fa, #e4ecff)" }}>
        <div className="container">
          <div className="section-title text-center mb-5">
            <span className="sub-title" style={{ color: "#ff4d4f", fontWeight: "600" }}>
              FAQ
            </span>
            <h2 style={{ fontWeight: "700" }}>Frequently Asked Questions</h2>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">

              {faqs.map((item, index) => (
                <div
                  key={index}
                  className="faq-card mb-3"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    background: "white"
                  }}
                >
                  {/* Question */}
                  <div
                    onClick={() => toggle(index)}
                    style={{
                      cursor: "pointer",
                      padding: "18px 20px",
                      background: active === index
                        ? "linear-gradient(135deg, #667eea, #764ba2)"
                        : "#ffffff",
                      color: active === index ? "#fff" : "#333",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "600"
                    }}
                  >
                    <span>{index + 1}. {item.q}</span>
                    <span style={{ fontSize: "20px" }}>
                      {active === index ? "−" : "+"}
                    </span>
                  </div>

                  {/* Answer */}
                  <div
                    style={{
                      maxHeight: active === index ? "200px" : "0",
                      overflow: "hidden",
                      transition: "0.4s ease",
                      padding: active === index ? "15px 20px" : "0 20px",
                      color: "#555",
                      lineHeight: "1.6"
                    }}
                  >
                    {item.a}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      <ClientFooter />
    </>
  );
}