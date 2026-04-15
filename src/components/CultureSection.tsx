"use client";

import { motion } from "framer-motion";
import { Rocket, Zap, Target, Users } from "lucide-react";

const values = [
  {
    icon: Rocket,
    title: "Protagonismo",
    desc: "Sos dueño de tus proyectos. Trabajamos con responsabilidad individual real.",
  },
  {
    icon: Zap,
    title: "Velocidad",
    desc: "Nos movemos rápido y aprendemos en el proceso.",
  },
  {
    icon: Target,
    title: "Impacto",
    desc: "Lo que hacemos tiene impacto directo en el producto y en la experiencia del cliente.",
  },
  {
    icon: Users,
    title: "Equipo",
    desc: "Trabajamos de forma colaborativa, con objetivos compartidos y comunicación directa.",
  },
];

const CultureSection = () => {
  return (
    <section id="cultura" className="py-10 bg-section-alt relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">¿Cómo es trabajar en Hoggax?</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground text-lg mb-2">{v.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CultureSection;