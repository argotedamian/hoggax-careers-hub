/**
 * Sanitización de inputs para prevenir XSS
 * Basado en mejores prácticas OWASP
 */

/**
 * Escapa caracteres HTML riskos para prevenir XSS
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] ?? char);
}

/**
 * Sanitiza un email - solo permite caracteres válidos
 */
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@.+_-]/g, "");
}

/**
 * Sanitiza un nombre - remove caracteres especiales
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/[<>&"'/]/g, "") // Remove dangerous chars
    .replace(/\s+/g, " ") // Normalize spaces
    .slice(0, 100); // Max length
}

/**
 * Sanitiza LinkedIn URL - permite solo URLs válidas
 */
export function sanitizeLinkedIn(url: string): string {
  // Solo permitir linkedin.com/in/ o linkedin.com/pub/
  const clean = url.trim().toLowerCase();
  if (!clean.includes("linkedin.com")) {
    return "";
  }
  return clean.slice(0, 200);
}

/**
 * Sanitiza área de interés
 */
export function sanitizeArea(area: string): string {
  const allowedAreas = [
    "Ventas",
    "Tecnología",
    "Marketing",
    "Diseño",
    "Administración y Cobranzas",
    "Legales",
  ];
  
  // Si existe en allowed, retornar
  if (allowedAreas.includes(area)) {
    return area;
  }
  // Remove caracteres riesgo
  return area.replace(/[^a-zA-Z0-9\sáéíóúñÑ]/g, "").slice(0, 50);
}

/**
 * Valida y sanitiza todos los inputs
 * @throws Error si la validación falla
 */
export function sanitizeInput(
  type: "email" | "name" | "linkedin" | "area",
  value: string
): string {
  switch (type) {
    case "email": {
      const email = sanitizeEmail(value);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format");
      }
      return email;
    }
    case "name": {
      const name = sanitizeName(value);
      if (name.length < 2) {
        throw new Error("Name too short");
      }
      return name;
    }
    case "linkedin": {
      const url = sanitizeLinkedIn(value);
      if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(url)) {
        throw new Error("Invalid LinkedIn URL");
      }
      return url;
    }
    case "area": {
      return sanitizeArea(value);
    }
    default:
      return value;
  }
}