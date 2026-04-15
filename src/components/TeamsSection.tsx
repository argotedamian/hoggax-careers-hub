"use client";

import { motion } from "framer-motion";
import { TrendingUp, Code, Megaphone, Palette, Calculator, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const teams = [
  { icon: TrendingUp, name: "Ventas" },
  { icon: Code, name: "Tecnología" },
  { icon: Megaphone, name: "Marketing" },
  { icon: Palette, name: "Diseño" },
  { icon: Calculator, name: "Administración" },
  { icon: Scale, name: "Legales" },
];

const teamPhotos = [
  "/images/team/team-4.jpg",
  "/images/team/team-5.jpg",
  "/images/team/team-6.jpg",
  "/images/team/team-7.jpg",
  "/images/team/team-8.jpg",
  "/images/team/team-9.jpg",
  "/images/team/team-10.jpg",
  "/images/team/team-11.jpg",
];

const TeamsSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prev = () => setCurrentSlide((s) => (s - 1 + teamPhotos.length) % teamPhotos.length);
  const next = useCallback(() => setCurrentSlide((s) => (s + 1) % teamPhotos.length), []);

  useEffect(() => {
    const interval = setInterval(next, 15000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <section className="pt-10 pb-0 bg-background relative overflow-hidden">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Nuestros equipos</h2>
          <p className="text-primary text-lg max-w-lg mx-auto">
            Cada uno cumple un rol clave en la experiencia que brindamos.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {teams.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:border-accent/40 hover:shadow-md transition-all duration-200 whitespace-nowrap"
            >
              <t.icon className="w-4 h-4 text-accent shrink-0" />
              <span className="font-medium text-foreground text-sm">{t.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-accent text-accent-foreground shadow-md flex items-center justify-center hover:bg-accent/90 transition-colors shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 overflow-hidden rounded-xl relative h-64 md:h-80">
              {teamPhotos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt="Equipo Hoggax"
                  className={`absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-700 ease-in-out ${
                    i === currentSlide ? "opacity-100" : "opacity-0"
                  }`}
                  style={i === 1 ? { objectPosition: "center 70%" } : i === 4 ? { objectPosition: "center 30%" } : undefined}
                  loading="lazy"
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-accent text-accent-foreground shadow-md flex items-center justify-center hover:bg-accent/90 transition-colors shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {teamPhotos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "bg-accent w-5" : "bg-border"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative w-full mt-8 -mb-1">
        <img
          src="/images/cityscape-illustration.png"
          alt=""
          className="w-full h-auto opacity-30"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-section-alt" />
      </div>
    </section>
  );
};

export default TeamsSection;