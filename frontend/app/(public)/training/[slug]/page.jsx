import TrainingPageClient from "./TrainingPageClient";

const API = process.env.NEXT_PUBLIC_API_BASE;

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/public/getsAllTraining`);
    const result = await res.json();
    const slugs = (result.data || []).map((item) => ({ slug: item.slug }));
    return slugs.length > 0 ? slugs : [{ slug: "__none__" }];
  } catch {
    return [{ slug: "__none__" }];
  }
}

export default async function TrainingPage({ params }) {
  const { slug } = await params;
  return <TrainingPageClient slug={slug} />;
}
