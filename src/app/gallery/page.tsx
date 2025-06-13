import Gallery from "../../../components/Gallery";

async function getImages(apiUrl: string) {
  const res = await fetch(`${apiUrl}/api/gallery-images?populate=Image`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

export default async function GalleryPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;
  const images = await getImages(apiUrl);

  return (
    <main className="flex flex-col items-center min-h-screen pt-16">
      <h1 className="text-3xl font-bold py-5">Галлерея работ</h1>
      <div className="mt-8 w-full max-w-2xl text-center pl-4 pr-4">
        <p>
          Избранные произведения Игоря Корякова, выполненные в различных графических техниках.
        </p>
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <Gallery images={images} apiUrl={apiUrl} />
      </div>
    </main>
  );
}