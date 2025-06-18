"use client";
import { useTranslations } from "next-intl";
import {useEffect, useState} from "react";

export default function HomePage() {
  const t = useTranslations("home-page");
  const [showImage, setShowImage] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowImage(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <>
<div className="fixed inset-0 w-full h-full bg-gradient-to-b from-black to-neutral-700 -z-20" />
      <div
         className={`fixed inset-0 w-full h-full bg-center bg-cover transition-opacity duration-1000 -z-10 ${showImage ? "opacity-100" : "opacity-0"}`}
         style={{ backgroundImage: "url('/DSC02789.jpg')" }}
      />
      <main className="relative min-h-screen flex flex-col">
        <div className="relative z-10 flex flex-1 items-start justify-start mr-30 pl-10 pt-20 sm:pt-20 sm:pl-20">
          <div className=" slide-in-left max-w-xl text-left whitespace-break-spaces relative">
            <h1 className="text-4xl text-white text-balance font-sans text-start sm:text-end mb-2">
              {t("title")}
            </h1>
            <p className="text-lg mb-2 text-white font-sans text-start sm:text-end">
              {t("subtitle")}
            </p>
            <p className="text-xs mb-2 text-white font-sans text-start sm:text-end">
              {t("bio1")}
            </p>
            <p className="text-xs mb-2 text-white font-sans text-start sm:text-end">
              {t("bio2")}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}