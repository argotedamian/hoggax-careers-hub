"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const jobs = [
  {
    title: "Ejecutivo/a Comercial SR.",
    area: "Ventas",
    modality: "Híbrido",
    description: "En Hoggax estamos buscando incorporar un/a Ejecutivo/a Comercial para sumarse al equipo.\nBuscamos perfiles con buenas habilidades de comunicación, proactividad para generar y desarrollar relaciones comerciales, y capacidad para acompañar a clientes durante todo el proceso.",
    responsibilities: [
      "Gestionar la operatoria diaria de casos de garantías en curso.",
      "Generar y desarrollar vínculos comerciales con inmobiliarias y brokers.",
      "Atender consultas de potenciales clientes a través de distintos canales (WhatsApp, webchat, teléfono y mail).",
      "Hacer seguimiento de cada caso, asegurando una buena experiencia para el cliente.",
      "Mantener actualizados los sistemas internos (CRM y back office).",
      "Colaborar en la correcta gestión y registro de la documentación asociada a las garantías.",
    ],
    requirements: [
      "Graduado/a o estudiante avanzado/a de carreras afines.",
      "Entre 2 y 5 años de experiencia en posiciones comerciales o de atención al cliente.",
      "Experiencia en el uso de CRM.",
      "Perfil autónomo, con iniciativa y capacidad de organización.",
      "Buenas habilidades de comunicación y trato con clientes.",
    ],
  },
];

const JobsSection = () => {
  const [selectedJob, setSelectedJob] = useState<typeof jobs[0] | null>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="busquedas" className="py-10 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Búsquedas abiertas</h2>
          <p className="text-primary text-lg max-w-lg mx-auto">
            Conocé las oportunidades actuales para sumarte al equipo.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg border border-border bg-card hover:border-accent/40 hover:shadow-md transition-all duration-200"
            >
              <div>
                <h3 className="font-semibold text-foreground text-lg group-hover:text-accent transition-colors">{job.title}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.area}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.modality}</span>
                </div>
                <button
                  onClick={() => setSelectedJob(job)}
                  className="mt-1.5 text-xs text-accent hover:underline transition-all"
                >
                  Ver más
                </button>
              </div>
              <Button variant="cta" size="sm" onClick={() => scrollTo("formulario")}>
                Postularme
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">
              {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2 overflow-y-auto flex-1 pr-1">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{selectedJob?.area}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedJob?.modality}</span>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Acerca del rol</h4>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{selectedJob?.description}</p>
            </div>
            {selectedJob?.responsibilities && selectedJob.responsibilities.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Responsabilidades</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  {selectedJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            {selectedJob?.requirements && selectedJob.requirements.length > 0 && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Requisitos</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
                  {selectedJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
          <Button
            variant="cta"
            className="w-full mt-4"
            onClick={() => {
              setSelectedJob(null);
              scrollTo("formulario");
            }}
          >
            Postularme
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default JobsSection;