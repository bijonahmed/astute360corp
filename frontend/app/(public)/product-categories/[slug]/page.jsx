import ShopByCategories from "./ShopByCategories";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const API = process.env.NEXT_PUBLIC_API_BASE;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/public/productsCategory`);
    const result = await res.json();
    const slugs = (result.data || []).map((item) => ({ slug: item.slug }));
    return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
  } catch {
    return [{ slug: "__none__" }];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

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

export default async function Page({ params }) {
  const { slug } = await params;

  return <ShopByCategories slug={slug} />;
}
