// "use client";
// import { useRouter, usePathname } from "next/navigation";

// const languages = [
//   { code: "en", label: "EN" },
//   { code: "ru", label: "RU" },
// ];

// export default function LanguageSwitcher() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const segments = pathname.split("/");

//   const handleSwitch = (lang: string) => {
//     segments[1] = lang;
//     const newPath = segments.join("/") || "/";
//     router.push(newPath);
//   };

//   return (
//     <div className="flex gap-2">
//       {languages.map(({ code, label }) => (
//         <button
//           key={code}
//           onClick={() => handleSwitch(code)}
//           className="px-2 py-1 rounded border text-xs hover:bg-gray-200"
//         >
//           {label}
//         </button>
//       ))}
//     </div>
//   );
// }

"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");
  const [open, setOpen] = useState(false);

  const handleSwitch = (lang: string) => {
    segments[1] = lang;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Desktop: show inline */}
      <div className="hidden sm:flex gap-2">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => handleSwitch(code)}
            className="px-2 py-1 text-xs hover:text-gray-500 cursor-pointer "
          >
            {label}
          </button>
        ))}
      </div>
      {/* Mobile: show dropdown */}
      <div className="sm:hidden">
  <button
    onClick={() => setOpen((v) => !v)}
    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-2 py-1 text-sm space-x-5 text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
    id="menu-button"
    aria-expanded={open}
    aria-haspopup="true"
  >
    {
      // Find the label for the current locale
      languages.find(l => l.code === segments[1])?.label || languages[0].label
    }
    <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  </button>
        {open && (
          <div className="absolute right-0 z-10 mt-2 w-15 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => handleSwitch(code)}
                className="block px-4 py-2 text-sm text-gray-700 hover:text-gray-500"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}