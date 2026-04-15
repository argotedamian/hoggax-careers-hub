"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const navItems = [
    { id: "busquedas", label: "Búsquedas abiertas" },
    { id: "cultura", label: "Cultura" },
    { id: "beneficios", label: "Beneficios" },
    { id: "proceso", label: "Proceso de selección" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <a href="https://hoggax.com/inquilinos" target="_blank" rel="noopener noreferrer">
          <img src="/hoggax-logo.svg" alt="Hoggax" className="h-7" />
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-primary hover:text-accent transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="cta" size="sm" onClick={() => scrollTo("formulario")}>
            Quiero sumarme
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-xl"
            >
              <div className="flex flex-col p-6 gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className="text-primary text-lg font-semibold py-3 border-b border-gray-100 text-left hover:text-accent transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="mt-4">
                  <Button variant="cta" className="w-full" onClick={() => scrollTo("formulario")}>
                    Quiero sumarme
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;