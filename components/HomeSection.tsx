"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
  textPosition?: 'left' | 'center' | 'right';
  textColor?: string;
  overlay?: boolean;
  overlayColor?: string;
  type?: 'hero' | 'gallery' | 'content' | 'fullscreen-gallery';
  onVisible?: (id: number) => void;
};

export default function Section({
  id,
  backgroundImage,
  images = [],
  title,
  subtitle,
  content,
  textPosition = 'center',
  textColor = 'text-white',
  overlay = true,
  overlayColor = 'bg-black/50',
  type = 'content',
  onVisible
}: SectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible?.(id);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [id, onVisible]);

  const getTextAlignment = () => {
    switch (textPosition) {
      case 'left': return 'items-start justify-start pl-10 sm:pl-20';
      case 'right': return 'items-start justify-end pr-10 sm:pr-20';
      default: return 'items-center justify-center';
    }
  };

  const getTextStyle = () => {
    switch (textPosition) {
      case 'left': return 'text-left max-w-xl';
      case 'right': return 'text-right max-w-xl';
      default: return 'text-center max-w-2xl';
    }
  };

  // Use type to determine section behavior
  const getTextSize = () => {
    switch (type) {
      case 'hero': return 'text-4xl sm:text-5xl';
      case 'gallery': return 'text-3xl';
      case 'fullscreen-gallery': return 'text-2xl';
      default: return 'text-3xl';
    }
  };

  const getSectionTag = () => {
    return type === 'hero' ? 'main' : 'section';
  };

  const SectionTag = getSectionTag() as 'main' | 'section';

  return (
    <SectionTag 
      ref={sectionRef}
      className="relative min-h-screen flex flex-col scroll-section"
      data-section-id={id}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className={`absolute inset-0 w-full h-full bg-center bg-cover transition-all duration-1500 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          }`}
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}

      {/* Overlay */}
      {overlay && (
        <div className={`absolute inset-0 w-full h-full ${overlayColor} transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`} />
      )}

      {/* Content - Different layout based on type */}
      {type !== 'gallery' && (
  <div className={`relative z-10 flex flex-1 ${getTextAlignment()} p-10 pt-20`}>
    <div className={`${getTextStyle()} ${textColor} transform transition-all duration-1000 delay-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
    }`}>
      <h1 className={`${getTextSize()} mb-4 font-sans`}>{title}</h1>
      {subtitle && (
        <h2 className="mb-6">{subtitle}</h2>
      )}
      {content.map((paragraph, index) => (
        <p key={index} className="text-sm mb-4 font-sans">
          {paragraph}
        </p>
      ))}
    </div>
  </div>
)}

      {/* Gallery Layout - Only for gallery type */}
{type === 'gallery' && (
        <>
          {/* Gallery Title */}
          <div className="relative z-10 flex items-center justify-center pt-20 pb-10">
            <div className={`text-center ${textColor} transform transition-all duration-1000 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <h1 className="text-3xl mb-4 font-sans">{title}</h1>
              {subtitle && (
                <h2 className="text-xl mb-6 font-sans">{subtitle}</h2>
              )}
            </div>
          </div>

          {/* Images Grid */}
          {images.length > 0 && (
            <div className={`relative z-10 flex-1 flex items-center justify-center transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-10 max-w-6xl">
                {images.map((image, index) => (
                  <div key={index} className={`transform transition-all duration-700 ${
                    isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`} style={{ transitionDelay: `${(index + 1) * 200}ms` }}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className={`rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ${image.className || ''}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Floating Images for content sections */}
      {type === 'content' && images.length > 0 && (
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-10 max-w-4xl">
            {images.map((image, index) => (
              <div key={index} className={`transform transition-all duration-700 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`} style={{ transitionDelay: `${(index + 1) * 200}ms` }}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className={`rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ${image.className || ''}`}
                />
              </div>
            ))}
          </div>
        </div>
          )}
          
          
          
{type === 'fullscreen-gallery' && (
  <>
    {/* Title overlay */}
    <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent pt-20 pb-10">
      <div className={`text-center ${textColor} transform transition-all duration-1000 delay-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        <h1 className="text-2xl mb-2 font-sans">{title}</h1>
        {subtitle && (
          <h2 className="text-lg mb-4 font-sans">{subtitle}</h2>
        )}
      </div>
    </div>

    {/* Fullscreen Images Grid */}
    {images.length > 0 && (
      <div className={`absolute inset-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`relative overflow-hidden transform transition-all duration-1000 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Optional overlay on hover */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
      </div>
    )}
  </>
)}

    </SectionTag>
  );
}