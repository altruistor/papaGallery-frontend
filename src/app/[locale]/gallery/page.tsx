import Gallery from "../../../../components/Gallery";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600; // повторно запрашивать у Strapi не чаще раза в час

async function getImages(apiUrl: string, locale: string) {
  try {
    const res = await fetch(`${apiUrl}/api/gallery-images?populate=Image&locale=${locale}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Server-side fetch uses direct Strapi URL (no CORS on server)
  const strapiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!;
  const images = await getImages(strapiUrl, locale);

  const t = await getTranslations({ locale });

  return (
    <main className="flex flex-col items-center min-h-screen pt-16">
      <h1 className="slide-in-left text-3xl font-bold py-5">{t("gallery-page.title")}</h1>
      <div className="slide-in-left w-full max-w-2xl text-center pl-4 pr-4">
        <p>{t("gallery-page.subtitle")}</p>
      </div>
      <div className="mt-8 w-full max-w-6xl">
        {/* Pass proxy prefix so client-side image URLs go through Next.js */}
        <Gallery images={images} apiUrl="/strapi" />
      </div>
    </main>
  );
}