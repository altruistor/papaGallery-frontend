import Gallery from "../../../../components/Gallery";
import { getTranslations } from "next-intl/server";

async function getImages(apiUrl: string, locale: string) {
  const res = await fetch(`${apiUrl}/api/gallery-images?populate=Image&locale=${locale}`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const images = await getImages(apiUrl, params.locale);

  // Use getTranslations for server components
  const t = await getTranslations({ locale: params.locale });

  return (
    <main className="flex flex-col items-center min-h-screen pt-16">
      <h1 className="text-3xl font-bold py-5">{t("gallery-page.title")}</h1>
      <div className="w-full max-w-2xl text-center pl-4 pr-4">
        <p>{t("gallery-page.subtitle")}</p>
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <Gallery images={images} apiUrl={apiUrl} />
      </div>
    </main>
  );
}