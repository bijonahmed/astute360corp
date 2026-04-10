export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        {/* Meta tags */}
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
        <meta name="author" content="Bir Ecommerce" />
        <meta
          name="keywords"
          content="Foldable Clothes Drying Racks, Vikars Ladder, WD-40 Anti Rust Spray, Bir Tools, Makita Power Tools, tools, hardware, home improvement, DIY, marketplace, shopping"
        />
        <meta
          name="description"
          content="Shop high-quality tools and hardware including Foldable Clothes Drying Racks, Vikars Ladder, WD-40 Anti Rust Spray, Bir Tools, and Makita Power Tools. Perfect for DIY and home improvement projects."
        />

        {/* CDN CSS links */}
        <link
          href="/src/css/admincustom.css"
          rel="stylesheet"
          crossOrigin="anonymous"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/source-sans-3@5.0.12/index.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/overlayscrollbars@2.11.0/styles/overlayscrollbars.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
        />
        <link rel="stylesheet" href="/dist/css/adminlte.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/apexcharts@3.37.1/dist/apexcharts.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/jsvectormap@1.5.3/dist/css/jsvectormap.min.css"
        />
      </head>
      <body className="layout-fixed sidebar-expand-lg sidebar-open bg-body-tertiary">
        {children}
      </body>
    </html>
  );
}
