import ShopByCategories from "./ShopByCategories";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { slug } = params;

  return {
    title: `${slug.replace(/-/g, " ")} - Bir E-Commerce`,
    description: `Explore ${slug.replace(
      /-/g,
      " "
    )} details on Bir E-Commerce.`,
    openGraph: {
      title: `${slug.replace(/-/g, " ")} - Bir E-Commerce`,
      url: `${baseUrl}/product-categories/${slug}`,
      images: ["/og-image-checkout.jpg"],
    },
    alternates: {
      canonical: `${baseUrl}/product-categories/${slug}`,
    },
  };
}

export default function Page({ params }) {
  const { slug } = params;

  return <ShopByCategories slug={slug} />;
}

return <></>;
