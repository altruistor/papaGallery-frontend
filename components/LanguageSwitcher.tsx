"use client";
import { useRouter, usePathname } from "next/navigation";

const languages = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/");

  const handleSwitch = (lang: string) => {
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