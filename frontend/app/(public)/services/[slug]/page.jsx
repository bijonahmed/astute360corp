import ServicesPageClient from "./ServicesPageClient";

const API = process.env.NEXT_PUBLIC_API_BASE;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/public/getsAllServices`);
    const result = await res.json();
    const slugs = (result.data || []).map((post) => ({ slug: post.slug }));
    return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
  } catch {
    return [{ slug: "__none__" }];
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  return <ServicesPageClient slug={slug} />;
}
