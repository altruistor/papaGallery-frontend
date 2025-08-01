"use client";
import React, { useEffect, useState } from "react";

import Button from "../../../../components/Button";
import { useTranslations } from "next-intl";


type PdfDocument = {
  url: string;
  [key: string]: unknown; // or add more fields if you know them
};

const MaterialsPage = () => {

  const t = useTranslations("materials-page");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/materials?populate=pdfDocument`)
      .then((res) => res.json())
      .then((data) => {
        setMaterials(data.data || []);
      })
      .catch((err) => {
        console.error("Ошибка загрузки материалов:", err);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const [materials, setMaterials] = useState<
  {
    id: number;
    Name: string;
    Description: string;
    publishedAt?: string;
    pdfDocument?: PdfDocument[];
  }[]
>([]);

  return (
    <>

     
        <main className="slide-in-left flex flex-col items-center min-h-screen pt-16 px-4">
          <h1 className="text-3xl text-center font-bold py-5">
            {t("title")}
          </h1>
          <div className="mt-8 mb-8 w-full max-w-2xl text-center pl-4 pr-4">
            <p>
              {t("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {materials.map((material) => {
            
            const { id, Name, Description, pdfDocument, publishedAt } = material;
            const pdf = pdfDocument?.[0] as PdfDocument | undefined;
            const pdfUrl = pdf?.url ? `${apiUrl}${pdf.url}` : null;

              return (
                <div
                  key={id}
                  className="slide-in-bottom bg-white border border-gray-200 rounded-xl shadow p-6 flex flex-col justify-between"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {Name}
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {Description}
                    </p>
                    {publishedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Опубликовано: {formatDate(publishedAt)}
                      </p>
                    )}
                  </div>
                  <div className="mt-6 flex gap-4 flex-wrap">
  {pdfUrl ? (
    <>
      <Button asLink href={pdfUrl} variant="primary">
        PDF
      </Button>
      <Button
  onClick={() => {
    if (navigator.share) {
      try {
        const fullUrl = new URL(pdfUrl, window.location.origin).href;
        navigator
          .share({
            title: material.Name,
            text: material.Description,
            url: fullUrl,
          })
          .catch((err) => {
            // Игнорируем отмену пользователем
            if (
              err.name === "AbortError" ||
              err.message === "Share canceled"
            ) {
              return;
            }
            console.error("Ошибка при попытке поделиться:", err);
          });
      } catch (e) {
        console.error("Ошибка формирования URL:", e);
      }
    } else {
      alert("Функция 'Поделиться' не поддерживается в этом браузере.");
    }
  }}
  variant="secondary"
>
  Поделиться
</Button>
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


    </>
  );
};

export default MaterialsPage;