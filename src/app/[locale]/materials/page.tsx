import { getTranslations } from "next-intl/server";
import Button from "../../../../components/Button";
import ShareButton from "../../../../components/ShareButton";

type PdfDocument = {
  url?: string;
  [key: string]: unknown;
};

type Material = {
  id: number;
  Name: string;
  Description: string;
  publishedAt?: string;
  pdfDocument?: PdfDocument[];
};

async function getMaterials(): Promise<Material[]> {
  const strapiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (!strapiUrl) return [];
  try {
    const res = await fetch(`${strapiUrl}/api/materials?populate=pdfDocument`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function MaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "materials-page" });
  const materials = await getMaterials();

  const strapiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";

  return (
    <main className="slide-in-left flex flex-col items-center min-h-screen pt-16 px-4">
      <h1 className="text-3xl text-center font-bold py-5">{t("title")}</h1>
      <div className="mt-8 mb-8 w-full max-w-2xl text-center pl-4 pr-4">
        <p>{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {materials.map((material) => {
          const pdf = material.pdfDocument?.[0];
          const pdfUrl = pdf?.url
            ? pdf.url.startsWith("http")
              ? pdf.url
              : `${strapiUrl}${pdf.url}`
            : null;

          return (
            <div
              key={material.id}
              className="slide-in-bottom bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {material.Name}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {material.Description}
                </p>
                {material.publishedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Опубликовано: {formatDate(material.publishedAt)}
                  </p>
                )}
              </div>
              <div className="mt-6 flex gap-4 flex-wrap">
                {pdfUrl ? (
                  <>
                    <Button asLink href={pdfUrl} variant="primary">
                      PDF
                    </Button>
                    <ShareButton title={material.Name} description={material.Description} />
                  </>
                ) : (
                  <p className="text-sm text-red-500">PDF не прикреплён</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}