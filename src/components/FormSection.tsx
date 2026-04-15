"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Upload, FileText, X, AlertCircle } from "lucide-react";
import { jobs } from "@/components/JobsSection";

// URL de la Lambda Function URL
const LAMBDA_URL = "https://igfq3yygbhn2cqj4maw5kolnx40zehas.lambda-url.us-east-1.on.aws/";

const areas = ["Ventas", "Tecnología", "Marketing", "Diseño", "Administración y Cobranzas", "Legales"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FormErrors {
  name?: string;
  email?: string;
  linkedin?: string;
  position?: string;
  areas?: string;
  cv?: string;
}

const FormSection = () => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAreaRequired = !selectedPosition || selectedPosition === "none";

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLinkedIn = (url: string): boolean => {
    const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, cv: "El archivo debe ser PDF" }));
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, cv: "El archivo no puede exceder 5MB" }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, cv: "" }));
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, cv: "El archivo debe ser PDF" }));
      return;
    }
    if (droppedFile.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, cv: "El archivo no puede exceder 5MB" }));
      return;
    }

    setFile(droppedFile);
    setErrors((prev) => ({ ...prev, cv: "" }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const form = document.querySelector("form");
    if (!form) return;

    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const linkedin = formData.get("linkedin") as string;

    const newErrors: FormErrors = {};

    if (field === "name" && touched.name) {
      if (!name) newErrors.name = "El nombre es obligatorio";
      else if (!validateName(name)) newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    if (field === "email" && touched.email) {
      if (!email) newErrors.email = "El email es obligatorio";
      else if (!validateEmail(email)) newErrors.email = "Ingresa un email válido";
    }

    if (field === "linkedin" && touched.linkedin) {
      if (!linkedin) newErrors.linkedin = "La URL de LinkedIn es obligatoria";
      else if (!validateLinkedIn(linkedin)) newErrors.linkedin = "Ingresa una URL válida de LinkedIn";
    }

    if (field === "position" && touched.position) {
      if (!selectedPosition) newErrors.position = "Seleccioná una posición";
    }

    if (field === "areas" && touched.areas && isAreaRequired) {
      if (selectedAreas.length === 0) newErrors.areas = "Seleccioná al menos un área";
    }

    if (field === "cv" && touched.cv) {
      if (!file) newErrors.cv = "El CV es obligatorio";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const linkedin = String(formData.get("linkedin") ?? "");

    const newErrors: FormErrors = {};

    if (!name) newErrors.name = "El nombre es obligatorio";
    else if (!validateName(name)) newErrors.name = "El nombre debe tener al menos 2 caracteres";

    if (!email) newErrors.email = "El email es obligatorio";
    else if (!validateEmail(email)) newErrors.email = "Ingresa un email válido";

    if (!linkedin) newErrors.linkedin = "La URL de LinkedIn es obligatoria";
    else if (!validateLinkedIn(linkedin)) newErrors.linkedin = "Ingresa una URL válida de LinkedIn";

    if (!selectedPosition) newErrors.position = "Seleccioná una posición";

    if (isAreaRequired && selectedAreas.length === 0) newErrors.areas = "Seleccioná al menos un área de interés";

    if (!file) newErrors.cv = "El CV es obligatorio";

    setErrors(newErrors);
    setTouched({ name: true, email: true, linkedin: true, position: true, areas: true, cv: true });

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Convertir PDF a base64 para enviar a Lambda
      const cvBase64 = file ? await fileToBase64(file) : "";

      const payload = {
        name,
        email,
        linkedin,
        position: selectedPosition,
        areas: selectedAreas,
        cv: cvBase64,
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch(LAMBDA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payloadError = await res.json().catch(() => ({}));
        setSubmitError(payloadError?.error ?? "No se pudo enviar la postulación");
        return;
      }

      setShowThankYou(true);
    } catch {
      setSubmitError("No se pudo enviar la postulación. Verificá la conexión e intentá de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="formulario" className="py-16 md:py-24 bg-section-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Queremos conocerte</h2>
          <p className="text-primary text-lg">Completá tus datos</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-6"
        >
          {/* Fila 1: Nombre y Email */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nombre y apellido <span className="text-accent">*</span>
              </label>
              <Input
                name="name"
                placeholder="Tu nombre completo"
                required
                className={`bg-card h-12 ${errors.name && touched.name ? "border-red-500 focus:border-red-500" : ""}`}
                onBlur={() => handleBlur("name")}
              />
              {errors.name && touched.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email <span className="text-accent">*</span>
              </label>
              <Input
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className={`bg-card h-12 ${errors.email && touched.email ? "border-red-500 focus:border-red-500" : ""}`}
                onBlur={() => handleBlur("email")}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              LinkedIn <span className="text-accent">*</span>
            </label>
            <Input
              name="linkedin"
              placeholder="https://linkedin.com/in/tu-perfil"
              required
              className={`bg-card h-12 ${errors.linkedin && touched.linkedin ? "border-red-500 focus:border-red-500" : ""}`}
              onBlur={() => handleBlur("linkedin")}
            />
            {errors.linkedin && touched.linkedin && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.linkedin}
              </p>
            )}
          </div>

          {/* Posición */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Posición a la que te postulás <span className="text-accent">*</span>
            </label>
            <Select value={selectedPosition} onValueChange={(value) => {
              setSelectedPosition(value ?? "");
              setTouched((prev) => ({ ...prev, position: true }));
              validateField("position");
            }}>
              <SelectTrigger className={`bg-card !h-12 w-full ${errors.position && touched.position ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Seleccioná una posición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna en particular</SelectItem>
                {jobs.map((job) => (
                  <SelectItem key={job.title} value={job.title}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.position && touched.position && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.position}
              </p>
            )}
          </div>

          {/* Áreas de interés */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Área de interés {isAreaRequired && <span className="text-accent">*</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    toggleArea(area);
                    setTouched((prev) => ({ ...prev, areas: true }));
                  }}
                  className={`px-3 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                    selectedAreas.includes(area)
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-card text-muted-foreground border-border hover:border-accent/40"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            {errors.areas && touched.areas && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.areas}
              </p>
            )}
          </div>

          {/* CV - File Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              CV (PDF) <span className="text-accent">*</span>
              <span className="text-muted-foreground font-normal ml-1">- Máx 5MB</span>
            </label>

            {!file ? (
              <label
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all bg-card"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  required
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <span className="text-sm text-muted-foreground text-center">
                  Arrastrá tu CV o hacé clic para subirlo
                </span>
                <span className="text-xs text-muted-foreground/70 mt-1">Solo PDF, máximo 5MB</span>
              </label>
            ) : (
              <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[200px] md:max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            )}
            {errors.cv && touched.cv && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.cv}
              </p>
            )}
          </div>

          {/* Mensaje opcional */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ¿Algo más que quieras contarnos? <span className="text-muted-foreground">(opcional)</span>
            </label>
            <Textarea
              placeholder="Contanos sobre vos, tus intereses, experiencia relevante..."
              className="bg-card min-h-[100px]"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            <span className="text-accent">*</span> Campos obligatorios.
          </p>

          {submitError && (
            <p className="text-red-500 text-xs flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {submitError}
            </p>
          )}

          <Button
            variant="cta"
            size="lg"
            type="submit"
            className="w-full text-base py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar postulación"}
          </Button>
        </motion.form>
      </div>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent" />
            </div>
            <DialogTitle className="text-2xl font-bold text-foreground">
              ¡Gracias por postularte!
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-3 leading-relaxed">
              Recibimos tu CV correctamente. Nuestro equipo lo va a revisar y, si tu perfil encaja con alguna búsqueda, nos vamos a contactar con vos.
            </DialogDescription>
          </DialogHeader>
          <Button variant="cta" className="mt-4" onClick={() => setShowThankYou(false)}>
            Cerrar
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FormSection;