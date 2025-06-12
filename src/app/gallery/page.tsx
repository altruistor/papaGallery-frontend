import React from "react";
import Navbar from "../../../components/Navbar";
import Gallery from "../../../components/Gallery";
import Footer from "../../../components/Footer";
import PageTransition from "../../../components/PageTransition";

const GalleryPage = () => (
    
  <>
        <Navbar />
        <PageTransition>
    <main className="flex flex-col items-center min-h-screen pt-16">
                <h1 className="text-3xl font-bold py-5">Галлерея работ</h1>
                <div className="mt-8 w-full max-w-2xl text-center pl-4 pr-4">
        <p>
        Избранные произведения Игоря Корякова, выполненные в различных графических техниках.
        </p>
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <Gallery />
      </div>
        </main></PageTransition>
        <Footer />
        </>
        
);

export default GalleryPage;