import ProductDetailsClient from "./ProductDetailsClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const API = process.env.NEXT_PUBLIC_API_BASE;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/public/productsCategory`);
    const result = await res.json();
    const slugs = [];
    for (const cat of (result.data || [])) {
      if (cat.slug) slugs.push({ slug: cat.slug });
      for (const p of (cat.products || [])) {
        if (p.slug) slugs.push({ slug: p.slug });
      }
    }
    return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
  } catch {
    return [{ slug: "__none__" }];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  return {
    title: `${slug.replace(/-/g, " ")} - Bir E-Commerce`,
    description: `Explore ${slug.replace(/-/g, " ")} details on Bir E-Commerce.`,
    openGraph: {
      title: `${slug.replace(/-/g, " ")} - Bir E-Commerce`,
      url: `${baseUrl}/product-details/${slug}`,
      images: ["/og-image-checkout.jpg"],
    },
    alternates: {
      canonical: `${baseUrl}/product-details/${slug}`,
    },
  };
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <ProductDetailsClient slug={slug}/>;
}
