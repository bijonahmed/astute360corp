import Link from "next/link";
import ClientNavbar from "../../../components/frontend/ClientNavbar";
import ClientFooter from "../../../components/frontend/ClientFooter";

export const metadata = {
  title: "About Us - FutureGenIT",
  description:
    "Learn more about FutureGenIT – a global IT solutions company delivering software development, SaaS products, cloud solutions, and IT consulting services since 2020.",
  keywords: [
    "FutureGenIT",
    "about FutureGenIT",
    "IT solutions company",
    "software development",
    "SaaS development",
    "IT consulting",
    "staff augmentation",
    "cloud solutions",
  ],
  openGraph: {
    title: "About Us - FutureGenIT",
    description:
      "FutureGenIT is a global technology company providing software development, SaaS solutions, IT consulting, and cloud services for startups and enterprises.",
    url: "https://futuregenit.com/about",
    siteName: "FutureGenIT",
    images: [
      {
        url: "/og-image-about.jpg",
        width: 1200,
        height: 630,
        alt: "About FutureGenIT",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://futuregenit.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <div>
        {/* Page Title */}
        <div className="page-title-area transparent-bg1">
          <div className="container">
            <div className="page-title-content text-start">
              <h2>About Us</h2>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>About</li>
              </ul>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div
      style={{
        padding: "100px 20px",
        background: "linear-gradient(135deg, #f5f7ff, #ffffff)",
      }}
      className="startup-about-area"
    >
      <div className="container-fluid">
        <div className="row align-items-center justify-content-center">

          <div className="col-lg-12 col-md-12">

            {/* Card Wrapper */}
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "50px",
                boxShadow: "0 15px 10px rgba(0,0,0,0.08)",
                border: "1px solid #eef0ff",
              }}
              className="startup-about-content"
            >

              <span
                style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  background: "#e8f0ff",
                  color: "#2563eb",
                  fontWeight: "600",
                  fontSize: "13px",
                  marginBottom: "15px",
                }}
              >
                ABOUT FUTUREGENIT
              </span>

              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  lineHeight: "1.4",
                  marginBottom: "20px",
                  color: "#111827",
                }}
              >
                Welcome To FutureGenIT – Global IT Solutions & Software Development Company
              </h2>

              <p style={{ color: "#4b5563", lineHeight: "1.8", marginBottom: "15px" }}>
                <strong>
                  Founded in 2020, FutureGenIT is a modern technology company
                  dedicated to delivering scalable, secure, and innovative digital
                  solutions that help businesses grow globally.
                </strong>
              </p>

              <p style={{ color: "#6b7280", lineHeight: "1.8", marginBottom: "15px" }}>
                Our expert team specializes in software development, SaaS product
                engineering, cloud solutions, IT consulting, and staff augmentation
                services. We transform ideas into powerful digital products for
                startups, SMEs, and enterprise clients.
              </p>

              <p style={{ color: "#6b7280", lineHeight: "1.8", marginBottom: "25px" }}>
                With a strong presence in the United States and growing global
                partnerships, FutureGenIT focuses on delivering high-quality
                solutions that improve business efficiency, reduce operational cost,
                and accelerate digital transformation.
              </p>

              {/* Features */}
              <ul
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "12px",
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {[
                  "End-to-End Software Development Solutions",
                  "Custom Web, Mobile & SaaS Application Development",
                  "Cloud Infrastructure & DevOps Solutions",
                  "AI Integration & Smart Automation Services",
                  "Dedicated IT Staff Augmentation Teams",
                  "24/7 Technical Support & Maintenance",
                ].map((item, index) => (
                  <li
                    key={index}
                    style={{
                      background: "#f9fafb",
                      padding: "12px 15px",
                      borderRadius: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      color: "#374151",
                      border: "1px solid #eee",
                    }}
                  >
                    <span style={{ color: "#2563eb", fontSize: "16px" }}>✔</span>
                    {item}
                  </li>
                ))}
              </ul>

            </div>

          </div>

        </div>
      </div>
    </div>
        {/* CTA Section */}
        <div className="cta-area ptb-100 jarallax">
          <div className="container">
            <div className="cta-content">
              <h2>Build Scalable Digital Products with FutureGenIT</h2>

              <p>
                Since 2020, FutureGenIT has been helping businesses transform
                ideas into powerful digital solutions. Let’s build something
                impactful together and scale your business globally.
              </p>

              <a href="/contact" className="default-btn">
                Contact Us <i className="fas fa-chevron-right" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
