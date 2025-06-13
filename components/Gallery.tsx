"use client";
import React, { useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

type GalleryProps = {
  images: GalleryImageApiItem[];
  apiUrl: string;
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

type GalleryImageApiItem = {
  id: number;
  Name: string;
  Alt: string;
  Description: string;
  Category: string;
  Image?: {
    url?: string;
    formats?: {
      medium?: {
        url?: string;
      };
    };
  };
};



// ...inside Gallery component...


const AnimatedCard = ({
  img,
  onClick,
}: {
  img: GalleryImage;
  onClick: () => void;
}) => {
  const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-4 break-inside-avoid flex flex-col items-center bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      <Image
        width={400}
        height={300}
        src={img.thumbnailUrl}
        alt={img.alt || img.title}
        className="w-full h-auto object-cover cursor-pointer"
        onClick={onClick}
      />
      <div className="w-full px-4 py-2 bg-gray-100">
        <div className="font-semibold text-base text-gray-800 text-center">
          {img.alt}
        </div>
      </div>
    </motion.div>
  );
};

const Gallery = ({ images: apiImages, apiUrl }: GalleryProps) => {
  // Convert API images to GalleryImage[]
  const images: GalleryImage[] = apiImages.map((item) => ({
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
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

    useEffect(() => {
        if (selectedIndex === null) return;
        const handler = (e: KeyboardEvent) => {
          if (e.key === "ArrowLeft" && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
          if (e.key === "ArrowRight" && selectedIndex < filteredImages.length - 1) setSelectedIndex(selectedIndex + 1);
          if (e.key === "Escape") setSelectedIndex(null);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
      }, [selectedIndex, filteredImages.length]);
    
    
  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(images.map((img) => img.category).filter(Boolean))),
  ];



  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
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
            {category === "all" ? "Все" : category}
          </button>
        ))}
      </div>

      <div className="columns-2 lg:columns-3 gap-4 space-y-4 pl-2 pr-2">
        {filteredImages.map((img, idx) =>
          img.thumbnailUrl ? (
            <AnimatedCard
              key={img.id}
              img={img}
              onClick={() => setSelectedIndex(idx)}
            />
          ) : null
        )}
          </div>
          
           {/* Modal for selected image starts */}

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
                  onClick={() => setSelectedIndex(null)}
                  onTouchStart={e => setTouchStartX(e.touches[0].clientX)}
  onTouchEnd={e => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50 && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
    if (deltaX < -50 && selectedIndex < filteredImages.length - 1) setSelectedIndex(selectedIndex + 1);
    setTouchStartX(null);
  }}
                  
              >
                  
                  {/* Left Arrow */}
    {selectedIndex > 0 && (
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
        onClick={e => {
          e.stopPropagation();
          setSelectedIndex(selectedIndex - 1);
        }}
        aria-label="Previous"
      >
        &#8592;
      </button>
    )}

    {/* Right Arrow */}
    {selectedIndex < filteredImages.length - 1 && (
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
        onClick={e => {
          e.stopPropagation();
          setSelectedIndex(selectedIndex + 1);
        }}
        aria-label="Next"
      >
        &#8594;
      </button>
    )}
          {/* Close button */}
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex(null);
            }}
            aria-label="Close"
          >
            &times;
          </button>

          <Zoom>
            <Image
               src={filteredImages[selectedIndex].fullUrl}
               alt={filteredImages[selectedIndex].alt || filteredImages[selectedIndex].title}
              width={1920}
              height={1080}
              className="max-h-[80vh] rounded shadow-lg"
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "80vh",
                display: "block",
                margin: "0 auto",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Zoom>
          <div className="mt-4 text-white text-sm max-w-2xl text-center px-4">
          {filteredImages[selectedIndex].description}
          </div>
        </div>
          )}
          
          
    </>
  );
    
};

export default Gallery;