// app/components/frontend/FrontendAssets.jsx
"use client";

import Script from "next/script";

export default function FrontendAssets() {
  return (
    <>
      <div>
        <link rel="dns-prefetch" href="http://fonts.googleapis.com/" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=yes"
        />

        <meta name="color-scheme" content="light dark" />

        <meta
          name="theme-color"
          content="#007bff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1a1a1a"
          media="(prefers-color-scheme: dark)"
        />

        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta name="author" content="FutureGenIT" />

        <meta
          name="keywords"
          content="FutureGenIT, IT solutions, software development, web development, mobile app development, SaaS development, technology consulting, staff augmentation, cloud solutions, DevOps services, API integration, enterprise software, AI solutions, digital transformation, IT services USA, global IT company"
        />

        <meta
          name="description"
          content="FutureGenIT is a global technology company providing software development, web & mobile app development, SaaS solutions, cloud services, AI integration, and IT consulting for startups and enterprises worldwide."
        />
        <title>FutureGenIT - IT Solutions & Software Development Company</title>

        {/* ================= CSS FILES ================= */}
        <link rel="stylesheet" href="/frontend_theme/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/frontend_theme/css/animate.min.css" />
        <link rel="stylesheet" href="/frontend_theme/css/fontawesome.min.css" />
        <link
          rel="stylesheet"
          href="/frontend_theme/css/magnific-popup.min.css"
        />
        <link
          rel="stylesheet"
          href="/frontend_theme/css/owl.theme.default.min.css"
        />
        <link
          rel="stylesheet"
          href="/frontend_theme/css/owl.carousel.min.css"
        />
        <link rel="stylesheet" href="/frontend_theme/css/odometer.min.css" />
        <link rel="stylesheet" href="/frontend_theme/css/rangeSlider.min.css" />
        <link
          rel="stylesheet"
          href="/frontend_theme/css/showMoreItems-theme.min.css"
        />
        <link rel="stylesheet" href="/frontend_theme/css/flaticon.css" />
        <link rel="stylesheet" href="/frontend_theme/css/meanmenu.min.css" />
        <link rel="stylesheet" href="/frontend_theme/css/style.css" />
        <link rel="stylesheet" href="/frontend_theme/css/responsive.css" />

        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/frontend_theme/js/bootstrap.bundle.min.js"
          strategy="beforeInteractive"
        />

        <Script
          src="/frontend_theme/js/magnific-popup.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/appear.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/odometer.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/smooth-scroll.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/rangeSlider.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/showMoreItems.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/mixitup.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/owl.carousel.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/ajaxchimp.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/frontend_theme/js/meanmenu.min.js"
          strategy="afterInteractive"
        />
        <Script src="/frontend_theme/js/main.js" strategy="afterInteractive" />
        <Script
          src="/frontend_theme/js/email-decode.min.js"
          strategy="afterInteractive"
        />
      </div>
    </>
  );
}
