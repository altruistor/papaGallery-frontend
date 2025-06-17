"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";

const frames = ["/eyeBirdFrame1.png", "/eyeBirdFrame2.png"];



// const BirdAnimation = () => {
//     const [frame, setFrame] = useState(0);
//     const [peckCount, setPeckCount] = useState(0);
  
//     useEffect(() => {
//       let interval: NodeJS.Timeout;
//       let timeout: NodeJS.Timeout;
  
//       if (peckCount < 6) {
//         interval = setInterval(() => {
//           setFrame((prev) => (prev + 1) % frames.length);
//           setPeckCount((prev) => prev + 1);
//         }, 350);
//       } else {
//         timeout = setTimeout(() => {
//           setPeckCount(0);
//         }, 60000);
//       }
  
//       return () => {
//         clearInterval(interval);
//         clearTimeout(timeout);
//       };
//     }, [peckCount]);
  
//     useEffect(() => {
//       if (peckCount === 0) setFrame(0);
//     }, [peckCount]);
  
//     return (
//       <img
//         src={frames[frame]}
//         alt="Bird pecking"
//         className="w-10 h-10"
//         draggable={false}
//       />
//     );
//   };

const BirdAnimation = () => {
    const [frame, setFrame] = useState(0);
    const [peckCount, setPeckCount] = useState(0);
  
    // Pecking logic: animate 6 times when triggered
    useEffect(() => {
      if (peckCount === 0) {
        setFrame(0);
        return;
      }
      let interval: NodeJS.Timeout;
      if (peckCount > 0 && peckCount < 9) {
        interval = setInterval(() => {
          setFrame((prev) => (prev + 1) % frames.length);
          setPeckCount((prev) => prev + 1);
        }, 120);
      }
      if (peckCount >= 7) {
        setPeckCount(0);
        setFrame(0);
      }
      return () => clearInterval(interval);
    }, [peckCount]);
  
    // Handler to start pecking
    const startPecking = () => {
      if (peckCount === 0) setPeckCount(1);
    };
  
    return (
      <Image
        src={frames[frame]}
        alt="Bird pecking"
        className="w-10 h-10 cursor-pointer"
            draggable={false}
            width={40}
      height={40}
        onMouseEnter={startPecking}
        onTouchStart={startPecking}
      />
    );
  };


  const Navbar = () => {
    const pathname = usePathname();
    const locale = pathname.split("/")[1] || "ru";
    const t = useTranslations("nav");
  
    return (
      <nav className="fixed top-0 w-full bg-white/60 backdrop-blur-md shadow z-50">
        <div className="max-w-4xl mx-auto flex items-center h-16">
          <div className="flex space-x-3 sm:space-x-6 items-center justify-center sm:justify-end w-full sm:pr-6 font-sans text-xs sm:text-sm uppercase">
            <Link
              href={`/${locale}/`}
              className={`text-gray-700 ${
                pathname === `/${locale}` || pathname === `/${locale}/` ? "font-semibold" : "hover:text-gray-500"
              }`}
            >
               {t("home")}
            </Link>
            <Link
              href={`/${locale}/gallery`}
              className={`text-gray-700 ${
                pathname.startsWith(`/${locale}/gallery`) ? "font-semibold" : "hover:text-gray-500"
              }`}
            >
              {t("gallery")}
            </Link>
            <Link
              href={`/${locale}/materials`}
              className={`text-gray-700 ${
                pathname.startsWith(`/${locale}/materials`) ? "font-semibold" : "hover:text-gray-500"
              }`}
            >
              {t("materials")}
            </Link>
            <LanguageSwitcher />
            <BirdAnimation />
          </div>
        </div>
      </nav>
    );
  };

export default Navbar;