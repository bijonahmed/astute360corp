import ServiceClient from "./ServiceClient";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://futuregenit.com";

export async function generateMetadata({ params }) {
  const { slug } = params;

  const title = slug
    ? `${slug.replace(/-/g, " ")} - FutureGenIT`
    : "Services - FutureGenIT";

  const description =
    "FutureGenIT provides end-to-end software development, SaaS solutions, cloud infrastructure, AI integration, and IT consulting services for startups and enterprises worldwide.";

  return {
    title,
    description,
    keywords: [
      "FutureGenIT services",
      "software development",
      "SaaS development",
      "IT consulting",
      "cloud solutions",
      "AI integration",
      "staff augmentation",
      "web development",
      "mobile app development",
    ],

    openGraph: {
      title,
      description,
      url: `${baseUrl}/service/${slug}`,
      siteName: "FutureGenIT",
      images: [
        {
          url: "/og-image-services.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },

    alternates: {
      canonical: `${baseUrl}/service/${slug}`,
    },
  };
}

export default function Page({ params }) {
  const { slug } = params;

  return <ServiceClient slug={slug} />;
}