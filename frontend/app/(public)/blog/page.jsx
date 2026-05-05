import BlogClient from "./BlogClient";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://futuregenit.com";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const formattedTitle = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Blog";

  const title = `${formattedTitle} - FutureGenIT`;

  const description =
    "Explore insights, tutorials, and industry trends from FutureGenIT covering software development, SaaS solutions, cloud computing, AI integration, and digital transformation.";

  return {
    title,
    description,

    keywords: [
      "FutureGenIT blog",
      "software development blog",
      "SaaS tutorials",
      "cloud computing",
      "AI integration",
      "IT consulting insights",
      "web development tips",
      "technology trends",
    ],

    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${slug}`,
      siteName: "FutureGenIT",
      images: [
        {
          url: "/og-image-blog.jpg", // better to separate blog image
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
    },

    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
  };
}

export default function Page({ params }) {
  const { slug } = params;
  return <BlogClient slug={slug} />;
}