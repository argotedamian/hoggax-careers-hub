"use server";

import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitizeEmail, sanitizeName, sanitizeLinkedIn, sanitizeArea } from "@/lib/sanitize";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function json(body: unknown, init?: ResponseInit) {
  return Response.json(body, init);
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function isFile(value: FormDataEntryValue | null): value is File {
  return !!value && typeof value !== "string";
}

// ========== GET: Generar CSRF token ==========
export async function GET() {
  // Generar un token CSRF simple (sin cookies - se envía en el form)
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutos

  return json(
    { token, expiresAt },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

// ========== POST: Submit aplicación ==========
export async function POST(req: Request) {
  // === 1. Rate Limiting ===
  const clientIp = getClientIp(req.headers);
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    console.warn(`[RATE-LIMIT] IP blocked: ${clientIp}, retry in ${Math.ceil(rateLimit.resetIn / 1000)}s`);
    return json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetIn / 1000)) } }
    );
  }

  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) {
    console.error(`[CONFIG] WEBHOOK_URL not configured`);
    return json(
      { ok: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  let incoming: FormData;
  try {
    incoming = await req.formData();
  } catch {
    console.warn(`[VALIDATION] Invalid form data from ${clientIp}`);
    return json(
      { ok: false, error: "Invalid request format" },
      { status: 400 }
    );
  }

  // === 2. CSRF Token Validation ===
  const csrfToken = asString(incoming.get("csrf_token"));
  const csrfExpires = asString(incoming.get("csrf_expires"));
  if (!csrfToken || !csrfExpires) {
    console.warn(`[CSRF] Missing token from ${clientIp}`);
    return json(
      { ok: false, error: "Security validation failed" },
      { status: 403 }
    );
  }
  if (Date.now() > parseInt(csrfExpires, 10)) {
    console.warn(`[CSRF] Expired token from ${clientIp}`);
    return json(
      { ok: false, error: "Session expired. Please refresh and try again." },
      { status: 403 }
    );
  }

  // === 3. Sanitización de inputs ===
  let name: string;
  let email: string;
  let linkedin: string;
  let position: string;
  let areas: string[];

  try {
    name = sanitizeName(asString(incoming.get("name")));
    email = sanitizeEmail(asString(incoming.get("email")));
    linkedin = sanitizeLinkedIn(asString(incoming.get("linkedin")));
    position = asString(incoming.get("position")).trim().slice(0, 100);
    areas = incoming
      .getAll("areas")
      .filter((v): v is string => typeof v === "string")
      .map(sanitizeArea)
      .filter(Boolean);
  } catch (e) {
    console.warn(`[SANITIZE] Failed: ${clientIp} - ${e}`);
    return json(
      { ok: false, error: "Invalid input format" },
      { status: 400 }
    );
  }

  // Validar que los campos no estén vacíos después de sanitizar
  if (!name || name.length < 2) {
    console.warn(`[VALIDATION] Invalid name from ${clientIp}`);
    return json(
      { ok: false, error: "Name is required" },
      { status: 400 }
    );
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.warn(`[VALIDATION] Invalid email from ${clientIp}`);
    return json(
      { ok: false, error: "Valid email is required" },
      { status: 400 }
    );
  }
  if (!linkedin) {
    console.warn(`[VALIDATION] Invalid LinkedIn from ${clientIp}`);
    return json(
      { ok: false, error: "Valid LinkedIn URL is required" },
      { status: 400 }
    );
  }
  if (!position) {
    console.warn(`[VALIDATION] No position selected from ${clientIp}`);
    return json(
      { ok: false, error: "Position is required" },
      { status: 400 }
    );
  }

  // Reemplazar values sanitizados en FormData
  incoming.set("name", name);
  incoming.set("email", email);
  incoming.set("linkedin", linkedin);
  incoming.set("position", position);
  // Rebuild areas
  incoming.delete("areas");
  areas.forEach((area) => incoming.append("areas", area));

  // === 4. Validar CV ===
  const cv = incoming.get("cv");
  if (!isFile(cv)) {
    console.warn(`[VALIDATION] Missing CV from ${clientIp}`);
    return json({ ok: false, error: "CV file is required" }, { status: 400 });
  }

  if (cv.type !== "application/pdf") {
    console.warn(`[VALIDATION] Invalid CV type from ${clientIp}: ${cv.type}`);
    return json({ ok: false, error: "CV must be a PDF" }, { status: 400 });
  }

  if (cv.size > MAX_FILE_SIZE) {
    console.warn(`[VALIDATION] CV too large from ${clientIp}: ${cv.size} bytes`);
    return json({ ok: false, error: "CV exceeds 5MB" }, { status: 400 });
  }

  // === 5. Enviar al webhook ===
  console.log(`[SUBMIT] Application received from ${email} (IP: ${clientIp})`);

  const webhookRes = await fetch(webhookUrl, {
    method: "POST",
    body: incoming,
  });

  if (!webhookRes.ok) {
    const text = await webhookRes.text().catch(() => "");
    console.error(`[WEBHOOK] Failed: ${webhookRes.status} - ${text.slice(0, 200)}`);
    return json(
      {
        ok: false,
        error: "Failed to submit application. Please try again.",
        status: webhookRes.status,
      },
      { status: 502 }
    );
  }

  console.log(`[SUBMIT] Success: ${email} for ${position}`);
  return json({ ok: true }, { status: 200 });
}

