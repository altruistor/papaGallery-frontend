"use client";
import { useTranslations } from "next-intl";
import Section from "../../../components/HomeSection";

export default function HomePage() {
  const t = useTranslations("home-page");

  // Define your sections data with translations
  const sectionsData = [
    {
      id: 1,
      type: 'hero' as const,
      backgroundImage: '/DSC02789.jpg',
      title: t("title"),
      subtitle: t("subtitle"), // Move subtitle here - this will be h2
      textPosition: 'left' as const,
      content: [t("bio1"), t("bio2")], // Remove subtitle from content - these will be p tags
      overlay: false
    },
    {
      id: 2,
      type: 'content' as const,
      backgroundImage: '/IMG_5169.jpeg',
      title: t("section2-title"),
      content: [t("section2-content")],
      textPosition: 'center' as const
    },
    {
      id: 3,
      type: 'fullscreen-gallery' as const,
      title: '',
      content: [],
      images: [
        { src: '/IMG_3660.jpeg', alt: t("gallery-image1-alt") },
        { src: '/58259.jpeg', alt: t("gallery-image2-alt") }

      ]
    },
    {
      id: 4,
      type: 'content' as const,
      backgroundImage: '/DSC02837.jpeg',
      title: t("section4-title"),
      subtitle: t("section4-subtitle"),
      content: [
        t("section4-content1"),
        t("section4-content2"),
        t("section4-content3")
      ],
      textPosition: 'right' as const,
      overlayColor: 'bg-neutral-900/70'
    }
    // Add more sections...
  ];

  return (
    <>
      {sectionsData.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          backgroundImage={section.backgroundImage}
          images={section.images}
          title={section.title}
          subtitle={section.subtitle}
          content={section.content}
          textPosition={section.textPosition}
          overlay={section.overlay}
          overlayColor={section.overlayColor}
          type={section.type}
        />
      ))}
    </>
  );
}