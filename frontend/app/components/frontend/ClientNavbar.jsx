// app/components/ClientNavbar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import useTraining from "../../hooks/useTrainingSearch";
import useService from "../../hooks/useServiceSearch";
import Loading from "../../components/Loading";

export default function ClientNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const traingCategoryId = 4;
  const serviceCategoryId = 4;
  const { trainingData = [] } = useTraining(traingCategoryId);
  const { serversData, settingData } = useService(serviceCategoryId) || {};

  useEffect(() => {
    console.log("Navbar settingData updated:", settingData);
  }, [settingData]);
  const [loading, setLoading] = useState(true);

  <style>{`
        .top-header-area {
          min-height: 30px;
          overflow: hidden;
        }
        .top-header-area .row {
          min-height: 30px;
        }
        .top-header-area i {
          display: inline-block;
          width: 16px;
          min-width: 16px;
          height: 14px;
          font-size: 14px;
          vertical-align: middle;
          flex-shrink: 0;
        }
        .top-header-area .top-header-social-links {
          display: flex;
          align-items: center;
          min-height: 30px;
          margin: 0;
          padding: 0;
        }
        .top-header-area .top-header-social-links li {
          display: flex;
          align-items: center;
        }
        .top-header-area .top-header-contact-info {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          min-height: 50px;
          gap: 15px;
          white-space: nowrap;
        }
        .top-header-area .top-header-contact-info a,
        .top-header-area .top-header-contact-info .lang-switcher {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }

        .top-header-contact-info a,
.top-header-contact-info .lang-switcher {
  margin-left: 20px; /* space between items */
}

.top-header-contact-info i {
  margin-right: 6px; /* space between icon and text */
}


      `}</style>;
  return (
    <div>
      <div className="top-header-area business-color d-none d-md-block">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-5 col-md-4">
              <ul className="top-header-social-links">
                <li>
                  <a href="https://www.facebook.com/login/" target="_blank">
                    <i className="fab fa-facebook-f" />
                  </a>
                </li>
                <li>
                  <a href="https://www.instagram.com/" target="_blank">
                    <i className="fab fa-instagram" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/" target="_blank">
                    <i className="fab fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/" target="_blank">
                    <i className="fab fa-linkedin-in" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-7 col-md-8">
              <div className="top-header-contact-info d-flex justify-content-end align-items-center gap-3">
                <a
                  href="#"
                  className="text-white d-flex align-items-center gap-1"
                >
                  <i className="fas fa-envelope" />
                  {settingData.email || "info@astute360corp.com"}
                </a>

                <a
                  href="tel:+44-45789-5789"
                  className="number d-flex align-items-center gap-1"
                >
                  <i className="fas fa-phone-alt" />
                  {settingData.tel || "+1 (346) 328-3273"}
                </a>

                <div className="lang-switcher d-flex align-items-center gap-1">
                  <label>
                    <i className="fas fa-globe" />
                  </label>
                  <select>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Top Header Area */}
      {/* Start Navbar Area */}
      <div className="navbar-area navbar-style-two bg-f9faff business-color">
        <div className="noke-responsive-nav">
          <div className="container">
            <div className="noke-responsive-menu">
              <div className="logo">
                <a href="/">
                  <Image
                    src="/frontend_theme/images/logo.png"
                    alt="logo"
                    width={150}
                    height={50}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="noke-nav">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-md navbar-light">
              <a className="navbar-brand" href="/">
                <Image
                  src="/frontend_theme/images/logo.png"
                  alt="logo"
                  width={150}
                  height={50}
                />
              </a>
              <div className="collapse navbar-collapse mean-menu">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link href="/" className="nav-link active">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/about" className="nav-link active">
                      About
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/services" className="dropdown-toggle nav-link">
                      Service
                    </Link>
                    <ul className="dropdown-menu">
                      {(() => {
                        const grouped = serversData.reduce((acc, item) => {
                          const key = item.subcategoryId;
                          if (!acc[key]) acc[key] = [];
                          acc[key].push(item);
                          return acc;
                        }, {});

                        const subcategoryNames = {
                          7: "SAP® Security Services",
                          6: "SAP® GRC Services",
                        };

                        return Object.entries(grouped).map(
                          ([subcatId, items]) => (
                            <li className="nav-item" key={subcatId}>
                              <a className="nav-link" href="#">
                                {subcategoryNames[subcatId] ||
                                  `Category ${subcatId}`}
                                <i className="fas fa-chevron-right" />
                              </a>
                              <ul className="dropdown-menu">
                                {items.map((item) => (
                                  <li className="nav-item" key={item.id}>
                                    <Link
                                      href={`/services/${item.slug}`}
                                      className="nav-link"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          ),
                        );
                      })()}
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link href="/training" className="dropdown-toggle nav-link">
                      Trainings
                    </Link>
                    <ul className="dropdown-menu">
                      {trainingData?.map((item) => (
                        <li className="nav-item" key={item.id}>
                          <Link
                            href={`/training/${item.slug}`}
                            className="nav-link"
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="nav-item">
                    <Link href="/blog" className="nav-link">
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/contact" className="nav-link">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {loading && pathname === "/" && <Loading />}
    </div>
  );
}
