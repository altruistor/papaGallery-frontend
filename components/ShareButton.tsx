"use client";
import Button from "./Button";

export default function ShareButton({ title, description }: { title: string; description: string }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({ title, text: description, url: window.location.href })
        .catch((err) => {
          if (err.name !== "AbortError") console.error(err);
        });
    } else {
      alert("Функция 'Поделиться' не поддерживается в этом браузере.");
    }
  };

  return (
    <Button onClick={handleShare} variant="secondary">
      Поделиться
    </Button>
  );
}
