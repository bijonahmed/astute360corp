/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      trailingSlash: true, // Recommended for static exports with dynamic routes
      //  output: 'export',
      images: {
            unoptimized: true,
      },
      // appDir: true,
};

export default nextConfig;
