import ProductDetailsClient from "./ProductDetailsClient";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function generateMetadata({ params }) {
  const { slug } = params;

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

export default function Page({ params }) {
  const { slug } = params; 

  return <ProductDetailsClient slug={slug}/>;
}

return (
   

     
  <></>
);
