import React from "react";

type FooterProps = {
  className?: string;
};

const Footer: React.FC<FooterProps> = ({ className = "" }) => (
  <footer className={`fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md text-gray-700 text-center py-4 border-t border-gray-200 ${className}`}>
    <div className="max-w-4xl mx-auto text-xs">
      &copy; {new Date().getFullYear()} Igor Koryakov. All rights reserved.
    </div>
  </footer>
);

export default Footer;