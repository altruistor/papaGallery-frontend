"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Кэш только для уже посещённых страниц (не текущей)
  // Текущая страница всегда рендерится через children напрямую — иначе Suspense/streaming не работает
  const [prevCache, setPrevCache] = useState<Record<string, React.ReactNode>>({});
  const prevPathname = useRef<string | null>(null);
  const prevChildren = useRef<React.ReactNode>(null);

  useEffect(() => {
    // Когда pathname меняется — сохраняем предыдущую страницу в кэш
    if (prevPathname.current && prevPathname.current !== pathname && prevChildren.current) {
      const key = prevPathname.current;
      const node = prevChildren.current;
      setPrevCache(prev => ({ ...prev, [key]: node }));
    }
    prevPathname.current = pathname;
    prevChildren.current = children;
  }, [pathname, children]);

  return (
    <>
      {/* Скрытые кэшированные предыдущие страницы — остаются смонтированными */}
      {Object.entries(prevCache).map(([path, node]) => (
        <div key={path} hidden>
          {node}
        </div>
      ))}
      {/* Текущая страница рендерится напрямую — Suspense и streaming работают корректно */}
      <div key={pathname}>
        {children}
      </div>
    </>
  );
}
