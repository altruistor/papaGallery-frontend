"use client";
import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "ru", label: "Ру" },
  { code: "en", label: "En" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSwitch = (lang: string) => {
    const segments = pathname.split("/");
    // segments[0] is "", segments[1] is the locale
    segments[1] = lang;
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      {languages.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className="px-2 py-1 rounded border text-xs hover:bg-gray-200"
        >
          {label}
        </button>
      ))}
    </div>
  );
}