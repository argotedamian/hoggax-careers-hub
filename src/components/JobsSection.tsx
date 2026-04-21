"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type JobSection = {
  title: string;
  items: string[];
  bulleted?: boolean;
};

type Job = {
  title: string;
  area: string;
  type?: string;
  modality: string;
  subtitle?: string;
  descriptionHighlight?: string;
  description: string;
  sections: JobSection[];
  closingText?: string;
};

export const jobs: Job[] = [
  {
    title: "Ejecutivo/a Comercial SR.",
    area: "Ventas",
    modality: "Híbrido",
    description: "En Hoggax estamos buscando incorporar un/a Ejecutivo/a Comercial para sumarse al equipo.\nBuscamos perfiles con buenas habilidades de comunicación, proactividad para generar y desarrollar relaciones comerciales, y capacidad para acompañar a clientes durante todo el proceso.",
    sections: [
      {
        title: "Responsabilidades",
        bulleted: true,
        items: [
          "Gestionar la operatoria diaria de casos de garantías en curso.",
          "Generar y desarrollar vínculos comerciales con inmobiliarias y brokers.",
          "Atender consultas de potenciales clientes a través de distintos canales (WhatsApp, webchat, teléfono y mail).",
          "Hacer seguimiento de cada caso, asegurando una buena experiencia para el cliente.",
          "Mantener actualizados los sistemas internos (CRM y back office).",
          "Colaborar en la correcta gestión y registro de la documentación asociada a las garantías.",
        ],
      },
      {
        title: "Requisitos",
        bulleted: true,
        items: [
          "Graduado/a o estudiante avanzado/a de carreras afines.",
          "Entre 2 y 5 años de experiencia en posiciones comerciales o de atención al cliente.",
          "Experiencia en el uso de CRM.",
          "Perfil autónomo, con iniciativa y capacidad de organización.",
          "Buenas habilidades de comunicación y trato con clientes.",
        ],
      },
    ],
  },
  {
    title: "Executive Assistant",
    area: "Administración y Cobranzas",
    type: "Part-time",
    modality: "Híbrido",
    subtitle: "Asistente Ejecutivo/a del CEO (Part-time)",
    descriptionHighlight: "¿Sos de esas personas que ordenan, anticipan y hacen que las cosas pasen?",
    description: "En Hoggax estamos buscando a alguien que trabaje con el CEO y se convierta en un apoyo clave para el día a día. Queremos sumar a una persona versátil, independiente, resolutiva y muy proactiva, con capacidad para moverse entre agenda, administración, oficina, eventos y gestiones personales con criterio, energía y confidencialidad.\n\nNo es un rol para \"solo asistir\".\n\nEs un rol para ayudar a que el CEO gane foco, tiempo y ejecución.",
    sections: [
      {
        title: "¿Qué va a hacer esta persona?",
        items: [
          "Llevar la agenda del CEO: reuniones, prioridades, recordatorios, viajes y cambios de último momento.",
          "Coordinar reuniones internas y externas, asegurando logística, seguimiento y orden.",
          "Colaborar en la administración y el funcionamiento general de la oficina.",
          "Acompañar la organización de eventos, actividades e iniciativas de la empresa.",
          "Coordinar proveedores, servicios y necesidades operativas del día a día.",
          "Dar soporte en gestiones personales del CEO con absoluta discreción y confianza.",
          "Hacer seguimiento de pendientes y ayudar a destrabar temas para que la operación avance.",
        ],
      },
      {
        title: "¿Qué perfil buscamos?",
        items: [
          "Una persona muy organizada, autónoma y confiable.",
          "Proactiva, práctica y con mentalidad resolutiva.",
          "Versátil y flexible para pasar de un tema a otro sin perder foco.",
          "Con buen criterio, capacidad de anticipación y atención al detalle.",
          "Con muy buenas habilidades interpersonales y de comunicación.",
          "Con discreción total para manejar información sensible.",
          "Cómoda usando Google Calendar, Google Workspace, Excel y herramientas de organización.",
        ],
      },
      {
        title: "Suma mucho si además",
        items: [
          "Tenés experiencia en asistencia ejecutiva, administración, office management o coordinación.",
          "Disfrutás los entornos ágiles y dinámicos.",
          "Te gusta estar cerca de la operación y de la toma de decisiones.",
          "Sos de esas personas que ven lo que falta y avanzan sin esperar instrucciones para todo.",
        ],
      },
      {
        title: "¿Qué ofrecemos?",
        items: [
          "Un rol part-time con impacto real.",
          "Trabajo directo con el CEO.",
          "Mucha exposición, variedad y aprendizaje.",
          "Un entorno donde el criterio, la actitud y la capacidad de resolver son clave.",
        ],
      },
    ],
    closingText: "Si te entusiasma estar donde pasan cosas, ordenar el caos y hacer que todo funcione mejor, nos encantaría conocerte.",
  },
];

const JobsSection = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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
                  <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{job.type ?? job.area}</span>
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

          <div className="space-y-5 mt-2 overflow-y-auto flex-1 pr-1">
            {/* Tags */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{selectedJob?.type ?? selectedJob?.area}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedJob?.modality}</span>
            </div>

            {/* Acerca del rol */}
            <div>
              <h4 className="font-semibold text-foreground mb-2">Acerca del rol</h4>
              {selectedJob?.subtitle && (
                <p className="text-accent text-sm mb-2">{selectedJob.subtitle}</p>
              )}
              {selectedJob?.descriptionHighlight && (
                <p className="font-semibold text-foreground mb-2">{selectedJob.descriptionHighlight}</p>
              )}
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm">
                {selectedJob?.description}
              </p>
            </div>

            {/* Secciones dinámicas */}
            {selectedJob?.sections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-foreground mb-2">{section.title}</h4>
                {section.bulleted ? (
                  <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-1.5 text-muted-foreground text-sm">
                    {section.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Texto de cierre */}
            {selectedJob?.closingText && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {selectedJob.closingText}
              </p>
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
