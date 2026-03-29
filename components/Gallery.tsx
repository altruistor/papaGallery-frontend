"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useGalleryStore, type GalleryImageApiItem } from "../src/store/galleryStore";

type GalleryProps = {
  images: GalleryImageApiItem[];
  apiUrl: string;
  locale: string;
  allLabel?: string;
  categoryLabels?: Record<string, string>;
};

type GalleryImage = {
  id: number;
  title: string;
  alt: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  fullUrl: string;
};

// ── Slide variants ────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "55%" : "-55%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-55%" : "55%", opacity: 0 }),
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({
  images,
  index,
  onClose,
  onGo,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onGo: (i: number) => void;
}) => {
  // Compute direction synchronously so AnimatePresence gets it before animation starts
  const prevIndexRef = useRef(index);
  const directionRef = useRef(0);
  if (index !== prevIndexRef.current) {
    directionRef.current = index > prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = index;
  }
  const direction = directionRef.current;

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const goNext = useCallback(() => {
    if (index < images.length - 1) onGo(index + 1);
  }, [index, images.length, onGo]);

  const goPrev = useCallback(() => {
    if (index > 0) onGo(index - 1);
  }, [index, onGo]);

  // Keyboard navigation
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goPrev, goNext, onClose]);

  // ── Zoom + pan state ────────────────────────────────────────────────────────
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastPinchDist = useRef<number | null>(null);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom when navigating
  useEffect(() => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  }, [index]);

  // Wheel zoom
  useEffect(() => {
    const el = zoomContainerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(z => {
        const next = Math.max(1, Math.min(5, z * (e.deltaY < 0 ? 1.1 : 0.9)));
        if (next === 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // Touch pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      setZoom(z => {
        const next = Math.max(1, Math.min(5, z * (dist / lastPinchDist.current!)));
        if (next === 1) setPanOffset({ x: 0, y: 0 });
        return next;
      });
      lastPinchDist.current = dist;
    }
  };
  const handleTouchEnd = () => { lastPinchDist.current = null; };

  // Mouse pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    e.stopPropagation();
    isPanning.current = true;
    lastMousePos.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    e.preventDefault();
    setPanOffset({ x: e.clientX - lastMousePos.current.x, y: e.clientY - lastMousePos.current.y });
  };
  const handleMouseUp = () => { isPanning.current = false; };

  const img = images[index];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* ── Top bar ── */}
      <div
        className="flex items-center justify-between px-5 py-3 bg-white/10 backdrop-blur-sm border-b border-white/10 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white/80 text-sm font-light truncate max-w-[60%]">{img.alt || img.title}</span>
        <span className="text-white/40 text-xs tabular-nums">{index + 1} / {images.length}</span>
        <button
          className="text-white/60 hover:text-white transition ml-4"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* ── Main image area ── */}
      <div
        ref={zoomContainerRef}
        className="flex-1 relative flex items-center justify-center overflow-hidden"
        onClick={e => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragStart={e => e.preventDefault()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: zoom > 1 ? "grab" : "default" }}
      >
        {/* Left arrow — fixed to viewport center */}
        {index > 0 && (
          <button
            className="fixed left-3 top-1/2 -translate-y-1/2 z-[60] bg-white/10 backdrop-blur-sm hover:bg-white/25 rounded-full w-11 h-11 flex items-center justify-center transition border border-white/10"
            onClick={e => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow — fixed to viewport center */}
        {index < images.length - 1 && (
          <button
            className="fixed right-3 top-1/2 -translate-y-1/2 z-[60] bg-white/10 backdrop-blur-sm hover:bg-white/25 rounded-full w-11 h-11 flex items-center justify-center transition border border-white/10"
            onClick={e => { e.stopPropagation(); goNext(); }}
            aria-label="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Slide-animated + draggable image */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            // swipe on mobile when not zoomed
            drag={zoom <= 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) goNext();
              if (info.offset.x > 80) goPrev();
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.fullUrl}
              alt={img.alt || img.title}
              draggable={false}
              style={{
                maxHeight: "68vh",
                maxWidth: "88vw",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                display: "block",
                borderRadius: "4px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                transform: `scale(${zoom}) translate(${panOffset.x / zoom}px, ${panOffset.y / zoom}px)`,
                transformOrigin: "center center",
                transition: zoom === 1 ? "transform 0.2s" : "none",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Zoom hint */}
        {zoom === 1 && (
          <div className="absolute bottom-2 right-3 text-white/30 text-xs pointer-events-none select-none">
            scroll / pinch to zoom
          </div>
        )}
        {zoom > 1 && (
          <button
            className="absolute bottom-2 right-3 text-white/50 text-xs hover:text-white/80 transition"
            onClick={e => { e.stopPropagation(); setZoom(1); setPanOffset({ x: 0, y: 0 }); }}
          >
            reset zoom ×{zoom.toFixed(1)}
          </button>
        )}
      </div>

      {/* ── Description ── */}
      {img.description && (
        <div
          className="text-center text-white/60 text-sm px-6 py-2 flex-shrink-0"
          onClick={e => e.stopPropagation()}
        >
          {img.description}
        </div>
      )}


    </motion.div>
  );
};

// ── Animated gallery card ─────────────────────────────────────────────────────
const AnimatedCard = ({
  img,
  onClick,
  skipAnimation,
}: {
  img: GalleryImage;
  onClick: () => void;
  skipAnimation?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const cardContent = (
    <>
      <Image
        width={400}
        height={300}
        src={img.thumbnailUrl}
        alt={img.alt || img.title}
        className="w-full h-auto object-cover cursor-pointer"
      />
      <div className="w-full px-4 py-2 bg-gray-100">
        <div className="text-base text-gray-800 text-center">{img.alt}</div>
      </div>
    </>
  );

  if (skipAnimation) {
    return (
      <div
        className="mb-4 break-inside-avoid flex flex-col items-center bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        onClick={onClick}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      className="mb-4 break-inside-avoid flex flex-col items-center bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      {cardContent}
    </motion.div>
  );
};

// ── Main Gallery component ────────────────────────────────────────────────────
const Gallery = ({ images: apiImages, apiUrl, locale, allLabel = "All", categoryLabels = {} }: GalleryProps) => {
  const { images: storedImages, setImages, hasImages, animated, markAnimated } = useGalleryStore();

  const cached = hasImages(locale);
  const hasAnimated = animated[locale] ?? false;
  const sourceImages: GalleryImageApiItem[] = cached ? storedImages[locale] : apiImages;

  useEffect(() => {
    if (!cached && apiImages.length > 0) setImages(locale, apiImages);
  }, [locale, apiImages, cached, setImages]);

  useEffect(() => {
    if (!hasAnimated && sourceImages.length > 0) {
      const timer = setTimeout(() => markAnimated(locale), 800);
      return () => clearTimeout(timer);
    }
  }, [hasAnimated, sourceImages.length, locale, markAnimated]);

  const images: GalleryImage[] = sourceImages.map((item) => ({
    id: item.id,
    title: item.Name,
    alt: item.Alt,
    description: item.Description,
    category: item.Category,
    thumbnailUrl: item.Image?.formats?.medium?.url
      ? item.Image.formats.medium.url.startsWith("http")
        ? item.Image.formats.medium.url
        : apiUrl + item.Image.formats.medium.url
      : "",
    fullUrl: item.Image?.url
      ? item.Image.url.startsWith("http")
        ? item.Image.url
        : apiUrl + item.Image.url
      : "",
  }));

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const categories = [
    "all",
    ...Array.from(new Set(images.map((img) => img.category).filter(Boolean))),
  ];

  return (
    <>
      {/* Category Filter */}
      <div className="slide-in-bottom flex flex-wrap gap-2 mb-6 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === category
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? allLabel : (categoryLabels[category.trim()] ?? category)}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 pl-2 pr-2">
        {filteredImages.map((img, idx) =>
          img.thumbnailUrl ? (
            <AnimatedCard
              key={img.id}
              img={img}
              onClick={() => setSelectedIndex(idx)}
              skipAnimation={hasAnimated}
            />
          ) : null
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <Lightbox
            images={filteredImages}
            index={selectedIndex}
            onClose={() => setSelectedIndex(null)}
            onGo={setSelectedIndex}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Gallery;

