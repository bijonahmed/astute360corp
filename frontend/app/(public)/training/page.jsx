import TrainingClient from "./TrainingClient";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://astute360corp.com";
export async function generateMetadata({ params }) {
  const { slug } = params;
  const title = slug
    ? `${slug.replace(/-/g, " ")} - Astute360corp`
    : "Training - Astute360corp";
  const description =
    "Learn more about Astute360corp – a quality & experience IT solution company helping customers realize the true potential of their IT organization since 2019.";
  return {
    title,
    description,
    keywords: [
      "Training",
      "IT solution company",
      "Astute360corp",
      "IT consulting",
    ],
    openGraph: {
      title,
      description,
      url: `${baseUrl}/training/${slug}`,
      siteName: "Astute360corp",
      images: [
        {
          url: "/og-image-training.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    alternates: {
      canonical: `${baseUrl}/training/${slug}`,
    },
  };
}
export default function Page({ params }) {
  const { slug } = params;
  return <TrainingClient slug={slug} />;
}
