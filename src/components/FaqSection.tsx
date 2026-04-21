"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "¿Puedo cargar mi CV sin que haya una búsqueda abierta?", a: "¡Sí! Podés completar el formulario en cualquier momento. Tu perfil queda en nuestra base para futuras oportunidades." },
  { q: "¿Aceptan perfiles sin experiencia?", a: "Sí, valoramos el potencial y las ganas de aprender. Contanos qué te motiva y por qué querés sumarte." },
  { q: "¿Cómo es el onboarding?", a: "Tenemos un proceso de onboarding estructurado para que te sientas cómodo/a desde el primer día. Incluye capacitación, acompañamiento y reuniones con cada equipo." },
  { q: "¿Hay posibilidades de crecimiento interno?", a: "Absolutamente. Promovemos el desarrollo profesional y muchos de nuestros líderes crecieron internamente." },
];

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg px-5 bg-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left font-medium text-foreground"
      >
        <span>{question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="shrink-0 ml-4"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FaqSection = () => (
  <section className="py-16 bg-background">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Preguntas frecuentes</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto space-y-3"
      >
        {faqs.map((faq, i) => (
          <FaqItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </motion.div>
    </div>
  </section>
);

export default FaqSection;
