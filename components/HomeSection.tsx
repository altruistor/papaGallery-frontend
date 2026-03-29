"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type SectionImage = {
  src: string;
  alt: string;
  className?: string;
};

type SectionProps = {
  id: number;
  backgroundImage?: string;
  images?: SectionImage[];
  title: string;
  subtitle?: string;
  content: string[];
  textPosition?: "left" | "center" | "right";
  textColor?: string;
  overlay?: boolean;
  overlayColor?: string;
  type?: "hero" | "content" | "photo-grid";
};


// ── Hero ──────────────────────────────────────────────────────────────────────
// Fullscreen, фон с zoom-out при загрузке, текст slide-in слева
function HeroSection({
  backgroundImage,
  title,
  subtitle,
  content,
  textColor = "text-white",
}: SectionProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <main className="relative h-screen flex items-end overflow-hidden">
      {backgroundImage && (
        <div
          className={`absolute inset-0 bg-center bg-cover transition-transform duration-[2000ms] ease-out ${
            ready ? "scale-100" : "scale-110"
          }`}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}
      <div className={`relative z-10 p-10 sm:p-20 pb-16 max-w-xl ${textColor}`}>
        <motion.h1
          className="text-4xl sm:text-5xl font-sans mb-4"
          initial={{ opacity: 0, x: -40 }}
          animate={ready ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.h2
            className="font-sans mb-4"
            initial={{ opacity: 0, x: -40 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {subtitle}
          </motion.h2>
        )}
        {content.map((p, i) => (
          <motion.p
            key={i}
            className="text-sm font-sans mb-1"
            initial={{ opacity: 0, x: -40 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.9 + i * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {p}
          </motion.p>
        ))}
      </div>
    </main>
  );
}

// ── Content ───────────────────────────────────────────────────────────────────
// Parallax-фон + текст появляется при скролле
function ContentSection({
  backgroundImage,
  title,
  subtitle,
  content,
  textPosition = "center",
  textColor = "text-white",
  overlay = true,
  overlayColor = "bg-black/50",
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // фон движется медленнее чем контент → parallax (±30% для заметного эффекта)
  const bgY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const alignClass =
    textPosition === "left"
      ? "items-start pl-10 sm:pl-20"
      : textPosition === "right"
      ? "items-end pr-10 sm:pr-20"
      : "items-center";
  const textAlignClass =
    textPosition === "left" ? "text-left" : textPosition === "right" ? "text-right" : "text-center";

  return (
    <section ref={sectionRef} className="relative min-h-[90vh] flex items-center py-32" style={{ isolation: "isolate" }}>
      {/* Клип-враппер: overflow-hidden здесь, чтобы parallax выходил за пределы фона но не вызывал скроллбар */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundImage && (
          <motion.div
            className="absolute inset-[-20%] bg-center bg-cover"
            style={{ backgroundImage: `url('${backgroundImage}')`, y: bgY }}
          />
        )}
        {overlay && <div className={`absolute inset-0 ${overlayColor}`} />}
      </div>

      <div className={`relative z-10 flex w-full flex-col ${alignClass} px-6`}>
        <motion.div
          className={`max-w-xl ${textColor} ${textAlignClass}`}
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {title && <h2 className="text-3xl font-sans mb-4">{title}</h2>}
          {subtitle && <h3 className="font-sans mb-4">{subtitle}</h3>}
          {content.map((p, i) => (
            <p key={i} className="text-sm font-sans mb-2">{p}</p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Photo Grid ────────────────────────────────────────────────────────────────
// Две (или больше) фотографии в ряд, fade+scale при появлении
function PhotoGridSection({ images = [] }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black">
      <div className="grid grid-cols-2">
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="relative aspect-[3/4] overflow-hidden"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.1, delay: i * 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="50vw"
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
export default function Section(props: SectionProps) {
  switch (props.type) {
    case "hero":
      return <HeroSection {...props} />;
    case "photo-grid":
      return <PhotoGridSection {...props} />;
    default:
      return <ContentSection {...props} />;
  }
}
