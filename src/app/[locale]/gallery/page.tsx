import { Suspense } from "react";
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

async function GalleryContent({ locale }: { locale: string }) {
  const strapiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL!;
  const images = await getImages(strapiUrl, locale);
  return <Gallery images={images} apiUrl="/strapi" />;
}

function GallerySpinner() {
  return (
    <div className="flex items-center justify-center w-full py-24">
      <svg
        className="animate-spin h-12 w-12 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return (
    <main className="flex flex-col items-center min-h-screen pt-16">
      <h1 className="slide-in-top text-3xl font-bold py-5">{t("gallery-page.title")}</h1>
      <div className="slide-in-top w-full max-w-2xl text-center pl-4 pr-4">
        <p>{t("gallery-page.subtitle")}</p>
      </div>
      <div className="mt-8 w-full max-w-6xl">
        <Suspense fallback={<GallerySpinner />}>
          <GalleryContent locale={locale} />
        </Suspense>
      </div>
    </main>
  );
}