"use client";
import React, { useEffect, useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { motion, useInView } from "framer-motion";
import Image  from "next/image";

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

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
      const fetchImages = async () => {
          const res = await fetch(
          `${apiUrl}/api/gallery-images?populate=Image`
      );
      const data = await res.json();
      if (!data.data) {
        setImages([]);
        return;
      }
      const images = data.data.map((item: GalleryImageApiItem) => ({
        id: item.id,
        title: item.Name,
        alt: item.Alt,
        description: item.Description,
        category: item.Category,
        thumbnailUrl: item.Image?.formats?.medium?.url
          ? apiUrl + item.Image.formats.medium.url
          : "",
        fullUrl: item.Image?.url
          ? apiUrl + item.Image.url
          : "",
      }));
      setImages(images);
    };
    fetchImages();
  }, []);

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(images.map((img) => img.category).filter(Boolean))),
  ];

  // Filter images by selected category
  const filteredImages =
    selectedCategory === "all"
      ? images
      : images.filter((img) => img.category === selectedCategory);

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
        {filteredImages.map((img) =>
          img.thumbnailUrl ? (
            <AnimatedCard
              key={img.id}
              img={img}
              onClick={() => setSelectedImage(img)}
            />
          ) : null
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold bg-black/40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            aria-label="Close"
          >
            &times;
          </button>

          <Zoom>
            <Image
                          
              src={selectedImage.fullUrl}
                          alt={selectedImage.alt || selectedImage.title}
                          width={1920} // or a large value
    height={1080} // or a large value
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
          <div className="mt-4 text-white text-lg max-w-2xl text-center px-4">
            {selectedImage.description}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;