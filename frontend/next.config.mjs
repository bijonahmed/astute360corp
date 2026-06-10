process.env.NEXT_PRIVATE_WORKER_THREADS = 'false';

/** @type {import('next').NextConfig} */
const nextConfig = {
      reactStrictMode: true,
      trailingSlash: true,
      output: 'export',
      images: {
            unoptimized: true,
      },
      typescript: {
            ignoreBuildErrors: true,
      },
};

export default nextConfig;
