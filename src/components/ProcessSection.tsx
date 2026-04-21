"use client";

import { motion } from "framer-motion";
import { FileText, Users, ClipboardCheck, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  {
    num: "01",
    title: "Aplicación",
    desc: "Revisamos tu perfil. Si hay una búsqueda abierta alineada con tu experiencia, te contactamos.",
    icon: FileText,
  },
  {
    num: "02",
    title: "Evaluación del perfil",
    desc: "Un formulario online y dos entrevistas para conocernos y profundizar en tu recorrido.",
    icon: Users,
  },
  {
    num: "03",
    title: "Instancias adicionales",
    desc: "Dependiendo del rol, puede haber una evaluación técnica o entrevistas con el equipo.",
    icon: ClipboardCheck,
  },
  {
    num: "04",
    title: "Feedback final",
    desc: "Te damos una respuesta al cierre del proceso, tanto si avanzamos como si no.",
    icon: MessageCircle,
  },
];

const ProcessSection = () => {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    let step = 0;
    let direction = 1;
    const interval = setInterval(() => {
      setActiveIndex(step);
      step += direction;
      if (step > 3) {
        direction = -1;
        step = 3;
      } else if (step < -1) {
        direction = 1;
        step = -1;
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="proceso" className="py-10 bg-section-alt relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Proceso de selección</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-[1.75rem] left-[12.5%] right-[12.5%] h-px bg-border" />
            {activeIndex >= 0 && (
              <div
                className="hidden md:block absolute top-[1.75rem] left-[12.5%] h-px bg-accent transition-all duration-700 ease-out"
                style={{ width: `${(activeIndex / 3) * 75}%` }}
              />
            )}

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex flex-col items-center text-center relative"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm shrink-0 relative z-10 mb-4 transition-all duration-500 ${
                    activeIndex >= i
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30 scale-110"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <step.icon className="w-6 h-6" />
                </div>

                <span className={`text-2xl font-bold tracking-widest mb-2 transition-colors duration-500 ${
                  activeIndex >= i ? "text-accent" : "text-muted-foreground"
                }`}>{step.num}</span>

                <h3 className="font-semibold text-foreground text-base mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[220px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 space-y-1"
        >
          <p className="text-muted-foreground/50 text-[11px]">
            Queremos que el proceso sea claro y ágil en cada etapa.
          </p>
          <p className="text-muted-foreground/50 text-[11px]">
            Si tenés dudas, podés escribirnos a{" "}
            <a href="mailto:people@hoggax.com" className="text-accent hover:underline font-medium">
              people@hoggax.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;