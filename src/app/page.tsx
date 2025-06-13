import React from "react";

const HomePage = () => {
 return (
  <>
    <div
      className="fade-in fixed inset-0 w-full h-full bg-fixed bg-center bg-cover -z-10"
      style={{ backgroundImage: "url('/DSC02789.jpg')" }}
    />
    <main className="relative min-h-screen flex flex-col">
      <div className="relative z-10 flex flex-1 items-start justify-start mr-30 pl-10 pt-20 sm:pt-20 sm:pl-20">
        <div className="max-w-xl text-left whitespace-break-spaces relative">
          {/* ВЕРТИКАЛЬНАЯ ЛИНИЯ
          <div className="absolute left-3 top-12 h-20 w-px bg-white opacity-70" /> */}
          {/* ГОРИЗОНТАЛЬНАЯ ЛИНИЯ */}
          {/* <div className="absolute left-3 top-22 h-px w-42 bg-white opacity-70" />  */}
          <h1 className="text-4xl text-white text-balance font-sans text-start sm:text-end mb-2">
            Игорь Коряков
          </h1>
          <p className="text-lg mb-2 text-white font-sans text-start sm:text-end">
            Художник, график,<br />изобретатель
          </p>
          <p className="text-xs mb-2 text-white font-sans text-start sm:text-end">
            Разрабатывал электронную технику 28 лет в Армии<br /> и 26 лет после неё
          </p>
          <p className="text-xs mb-2 text-white font-sans text-start sm:text-end">
            Фанат карандашной графики с придумками
          </p>
        </div>
      </div>
    </main>
</>
  );
};

export default HomePage;