"use client";

import { motion } from "framer-motion";
import { Home, Trophy, TrendingUp, Palmtree, CalendarHeart, Cake, Cookie, Gift, PartyPopper } from "lucide-react";

const benefits = [
  { icon: Home, label: "Modalidad híbrida", sub: "3 días en oficina y 2 de home office." },
  { icon: Trophy, label: "Premios por resultados", sub: "Aplicables una vez finalizado el período de prueba." },
  { icon: TrendingUp, label: "Ajustes salariales", sub: "Revisiones periódicas." },
  { icon: Palmtree, label: "Vacaciones", sub: "2 semanas (días hábiles)." },
  { icon: CalendarHeart, label: "Semana Hoggax", sub: "Una semana adicional para quienes hayan finalizado sus estudios." },
  { icon: Cake, label: "Día de cumpleaños", sub: "Día libre." },
  { icon: Cookie, label: "Snacks en oficina", sub: "Disponibles durante la jornada." },
  { icon: Gift, label: "Plataforma de beneficios", sub: "Acceso a Bonda." },
  { icon: PartyPopper, label: "Afters y jornadas de equipo", sub: "Espacios para compartir fuera del día a día." },
];

const BenefitsSection = () => (
  <section id="beneficios" className="py-16 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Nuestros beneficios</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {benefits.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:bg-accent hover:border-accent transition-all duration-300 cursor-default"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 group-hover:bg-white/20 flex items-center justify-center mb-3 transition-colors duration-300">
              <b.icon className="w-5 h-5 text-accent group-hover:text-white transition-colors duration-300" />
            </div>
            <span className="font-medium text-foreground text-sm group-hover:text-white transition-colors duration-300">{b.label}</span>
            {b.sub && <span className="text-muted-foreground text-xs mt-1 leading-relaxed group-hover:text-white/80 transition-colors duration-300">{b.sub}</span>}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;