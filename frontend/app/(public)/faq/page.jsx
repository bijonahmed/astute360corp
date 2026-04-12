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
      q: "What services does Astute360corp provide?",
      a: "Astute360corp is an all-in-one IT solution company offering web development, mobile app development, software solutions, digital marketing, cloud services, and IT consulting to help businesses grow efficiently."
    },
    {
      q: "Why should I choose Astute360corp?",
      a: "Since 2019, Astute360corp has been delivering quality IT solutions with an expert team, transparent workflow, and a strong focus on understanding client needs to ensure the best possible outcomes."
    },
    {
      q: "Do you provide custom software solutions?",
      a: "Yes, we specialize in building custom software tailored to your business requirements. Our team works closely with you to understand your goals and deliver scalable and efficient solutions."
    },
    {
      q: "How long does it take to complete a project?",
      a: "Project timelines vary depending on complexity and requirements. Small projects may take a few days, while larger systems can take several weeks. We always provide a clear timeline before starting."
    },
    {
      q: "Do you offer 24/7 support?",
      a: "Yes, we provide 24/7 support to ensure your systems run smoothly. Our support team is always ready to assist you with any technical issues or urgent requirements."
    },
    {
      q: "Can you help improve my business online presence?",
      a: "Absolutely! We offer SEO, social media marketing, and data-driven digital strategies to increase your brand visibility and drive more traffic and conversions."
    },
    {
      q: "What industries do you work with?",
      a: "We work with a wide range of industries including healthcare, e-commerce, education, corporate businesses, and startups, providing tailored IT solutions for each sector."
    },
    {
      q: "How can I get started with Astute360corp?",
      a: "You can contact us through our website or call our team. We will discuss your requirements, analyze your needs, and provide the best solution to achieve your business goals."
    }
  ];

  return (
    <>
    

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
            <p style={{ maxWidth: "600px", margin: "10px auto", color: "#666" }}>
              Learn more about Astute360corp, our services, and how we help businesses grow with modern IT solutions.
            </p>
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
                      maxHeight: active === index ? "250px" : "0",
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

    </>
  );
}