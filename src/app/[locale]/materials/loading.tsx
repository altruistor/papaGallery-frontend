export default function MaterialsLoading() {
  return (
    <main className="flex flex-col items-center min-h-screen pt-16">
      <div className="flex flex-col items-center justify-center flex-1 mt-32 gap-4 text-gray-500">
        <svg
          className="animate-spin h-10 w-10 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
        <p className="text-sm">Загрузка материалов…</p>
      </div>
    </main>
  );
}
