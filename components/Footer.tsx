import React from "react";

type FooterProps = {
    className?: string;
  };

  const Footer: React.FC<FooterProps> = ({ className = "" }) => (
    <footer className={`bg-white/60 backdrop-blur-md text-gray-700 text-center py-4 mt-8 ${className}`}>
      <div className="max-w-4xl mx-auto text-xs">
        &copy; {new Date().getFullYear()} Игорь Коряков. All rights reserved.
      </div>
    </footer>
  );
  
  export default Footer;