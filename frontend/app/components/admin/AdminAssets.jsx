"use client";

import Script from "next/script";

export default function AdminAssets() {
  return (
    <>
      <Script src="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/browser/overlayscrollbars.browser.es6.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.min.js" />
      <Script src="/dist/js/adminlte.js" strategy="afterInteractive" />
    </>
  );
}
