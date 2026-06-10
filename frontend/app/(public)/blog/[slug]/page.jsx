import BlogPageClient from "./BlogPageClient";

const API = process.env.NEXT_PUBLIC_API_BASE;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/public/getsBlogPost`);
    const result = await res.json();
    const slugs = (result.data || []).map((post) => ({ slug: post.slug }));
    return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
  } catch {
    return [{ slug: "__none__" }];
  }
}

export default async function BlogPage({ params }) {
  const { slug } = await params;
  return <BlogPageClient slug={slug} />;
}
