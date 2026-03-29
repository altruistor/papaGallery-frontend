"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Кэш страниц по pathname — держим в DOM, не размонтируем
  const [cache, setCache] = useState<Record<string, React.ReactNode>>(() => ({
    [pathname]: children,
  }));

  // Следим за уже посещёнными путями (ref, не state — не вызывает ре-рендер)
  const seenPaths = useRef<Set<string>>(new Set([pathname]));

  useEffect(() => {
    seenPaths.current.add(pathname);
    // Обновляем контент текущей страницы (или добавляем новую)
    setCache(prev => ({ ...prev, [pathname]: children }));
  }, [pathname, children]);

  return (
    <>
      {Object.entries(cache).map(([path, node]) => (
        // hidden=true → display:none, но компонент остаётся смонтированным в React-дереве
        <div key={path} hidden={path !== pathname ? true : undefined}>
          {node}
        </div>
      ))}
    </>
  );
}
