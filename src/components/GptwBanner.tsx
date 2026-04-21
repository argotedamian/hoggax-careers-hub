const GptwBanner = () => (
  <section id="gptw" aria-label="Great Place to Work 2026" className="w-full bg-white pb-12 md:pb-16">
    <div className="w-full">
      <div className="relative w-full bg-primary">

        {/* Cuadrados decorativos rojos - solo en desktop */}
        <span aria-hidden className="pointer-events-none hidden md:block absolute top-2 left-[4%] w-6 h-5 z-10" style={{ backgroundColor: "#E63329" }} />
        <span aria-hidden className="pointer-events-none hidden md:block absolute top-1 left-[26%] w-9 h-4 z-10" style={{ backgroundColor: "#E63329" }} />
        <span aria-hidden className="pointer-events-none hidden md:block absolute bottom-2 left-[16%] w-7 h-4 z-10" style={{ backgroundColor: "#E63329" }} />
        <span aria-hidden className="pointer-events-none hidden md:block absolute bottom-3 left-[42%] w-10 h-5 z-10" style={{ backgroundColor: "#E63329" }} />
        <span aria-hidden className="pointer-events-none hidden md:block absolute top-3 right-[24%] w-8 h-4 z-10" style={{ backgroundColor: "#E63329" }} />
        <span aria-hidden className="pointer-events-none hidden md:block absolute bottom-2 right-[6%] w-6 h-5 z-10" style={{ backgroundColor: "#E63329" }} />

        <div className="relative z-20 flex items-center justify-center gap-4 md:gap-12 px-6 md:px-12 py-6 md:py-8">
          <p className="text-center text-white font-display font-bold text-sm md:text-xl lg:text-2xl leading-tight">
            Somos uno de los mejores lugares para trabajar en Argentina
          </p>

          <div className="shrink-0 flex items-center justify-center">
            <img
              src="/gptw-badge-certificada.png"
              alt="Great Place to Work Certificada - Argentina Jun 2025-Jun 2026"
              loading="lazy"
              className="h-36 md:h-40 lg:h-48 w-auto drop-shadow-lg -my-10 md:-my-10 lg:-my-12"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default GptwBanner;
