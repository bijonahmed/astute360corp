import Link from "next/link";
import ClientNavbar from "../../../components/frontend/ClientNavbar";
import ClientFooter from "../../../components/frontend/ClientFooter";

export const metadata = {
  title: "About Us - Astute360corp",
  description:
    "Learn more about Astute360corp – a quality & experience IT solution company helping customers realize the true potential of their IT organization since 2019.",
  keywords: [
    "about us",
    "IT solution company",
    "Astute360corp",
    "IT consulting",
  ],
  openGraph: {
    title: "About Us - Astute360corp",
    description:
      "Learn more about Astute360corp – a quality & experience IT solution company helping customers realize the true potential of their IT organization since 2019.",
    url: "https://astute360corp.com/about",
    siteName: "Astute360corp",
    images: [
      {
        url: "/og-image-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Astute360corp",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://astute360corp.com/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <div>
        {/* Start Page Title Area */}
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
        {/* End Page Title Area */}

        {/* Start About Area */}
        <div className="startup-about-area ptb-100">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-6 col-md-12">
                <div className="startup-about-image">
                  <div className="shape4">
                    <img src="/frontend_theme/images/shape4.png" alt="image" />
                  </div>
                  <video
                    width="100%"
                    height={400}
                    controls
                    autoPlay
                    muted
                    playsInline
                  >
                    <source
                      src="/frontend_theme/videos/astute360corp-bio.mp4"
                      type="video/mp4"
                    />
                  </video>
                  <div className="shape5">
                    <img src="/frontend_theme/images/shape5.png" alt="image" />
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div className="startup-about-content">
                  <span className="sub-title">ABOUT ASTUTE360CORP</span>
                  <h2>
                    Welcome To Astute360corp – Quality &amp; Experience IT
                    Solution Company
                  </h2>
                  <p>
                    <strong>
                      In 2019, Astute360corp set out with a goal – to help
                      customers realize the true potential of their IT
                      organization. We accomplish this through a unique and
                      transparent business model.
                    </strong>
                  </p>
                  <p>
                    Our accomplished team, in-house technical expertise, and
                    collective curiosity to hear YOUR story lays the foundation
                    for a fruitful consulting engagement time and time again.
                  </p>
                  <ul className="features-list">
                    <li>All In One IT Solution Company</li>
                    <li>Amazing Expert Teams</li>
                    <li>Quality Solution For Business</li>
                    <li>24/7 Quick Supports</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End About Area */}

        {/* Start Funfacts Area */}
        <div className="funfacts-area pb-70">
          <div className="container">
            <div className="section-title">
              <h2>We Are Establishing a Startup Authorization Company</h2>
              <p>
                Since 2019, Astute360corp has been delivering exceptional IT
                consulting services, building lasting partnerships and driving
                real results for businesses of all sizes.
              </p>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-3 col-sm-6 col-md-6 col-6">
                <div className="single-funfacts-box">
                  <i className="icon flaticon-file" />
                  <h3>
                    <span className="odometer" data-count={2546}>
                      50
                    </span>
                  </h3>
                  <span className="sub-title">Project Complete</span>
                  <img
                    src="/frontend_theme/images/border.png"
                    alt="image"
                    className="shape"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-md-6 col-6">
                <div className="single-funfacts-box">
                  <i className="icon flaticon-rating-2" />
                  <h3>
                    <span className="odometer" data-count={2495}>
                      400
                    </span>
                  </h3>
                  <span className="sub-title">Happy Clients</span>
                  <img
                    src="/frontend_theme/images/border.png"
                    alt="image"
                    className="shape"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-md-6 col-6">
                <div className="single-funfacts-box">
                  <i className="icon flaticon-group" />
                  <h3>
                    <span className="odometer" data-count={172}>
                      300
                    </span>
                  </h3>
                  <span className="sub-title">Qualified Staffs</span>
                  <img
                    src="/frontend_theme/images/border.png"
                    alt="image"
                    className="shape"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6 col-md-6 col-6">
                <div className="single-funfacts-box">
                  <i className="icon flaticon-trophy" />
                  <h3>
                    <span className="odometer" data-count={7}>
                      20
                    </span>
                  </h3>
                  <span className="sub-title">Winning Awards</span>
                  <img
                    src="/frontend_theme/images/border.png"
                    alt="image"
                    className="shape"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Funfacts Area */}

        {/* Start CTA Area */}
        <div className="cta-area ptb-100 jarallax">
          <div className="container">
            <div className="cta-content">
              <h2>
                Perfect For Creators Looking to Build Your Better Business
              </h2>
              <p>
                Since 2019, Astute360corp has been helping organizations unlock
                the true potential of their IT. Let us hear YOUR story and build
                something great together.
              </p>
              <a href="/contact" className="default-btn">
                Contact Us <i className="fas fa-chevron-right" />
              </a>
            </div>
          </div>
        </div>
        {/* End CTA Area */}
      </div>
     
    </>
  );
}
