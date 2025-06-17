
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations();


  return (
    <>
      <div
        className="fade-in fixed inset-0 w-full h-full bg-center bg-cover -z-10"
        style={{ backgroundImage: "url('/DSC02789.jpg')" }}
      />
      <main className="relative min-h-screen flex flex-col">
        <div className="relative z-10 flex flex-1 items-start justify-start mr-30 pl-10 pt-20 sm:pt-20 sm:pl-20">
          <div className="max-w-xl text-left whitespace-break-spaces relative">
            <h1 className="text-4xl text-white text-balance font-sans text-start sm:text-end mb-2">
              {t("home-page.title")}
            </h1>
            <p className="text-lg mb-2 text-white font-sans text-start sm:text-end">
              {t("home-page.subtitle")}
            </p>
            <p className="text-xs mb-2 text-white font-sans text-start sm:text-end">
              {t("home-page.bio1")}
            </p>
            <p className="text-xs mb-2 text-white font-sans text-start sm:text-end">
              {t("home-page.bio2")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}