/**
 * AWS Lambda para formulario de postulaciones
 *
 * Deploy: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 *
 * ENVIRONMENT VARIABLES:
 *   - N8N_WEBHOOK_URL: Tu webhook de n8n
 */

// Configuración del webhook - completar cuando tengas la URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://tuservidor.n8n.io/webhook/form";

export const handler = async (event) => {
  try {
    // Parsear el body
    const body = event.body ? JSON.parse(event.body) : {};

    console.log("Received form submission:", body.name, body.email);

    // Validar campos requeridos
    const required = ["name", "email", "position"];
    for (const field of required) {
      if (!body[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `Missing field: ${field}` }),
        };
      }
    }

    // Enviar al webhook de n8n
    const webhookRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        submittedAt: new Date().toISOString(),
        source: "hoggax-careers-form",
      }),
    });

    if (!webhookRes.ok) {
      const errorText = await webhookRes.text().catch(() => "Unknown error");
      console.error("Webhook error:", webhookRes.status, errorText);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Webhook failed", details: errorText }),
      };
    }

    console.log("Form submitted successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, message: "Application submitted successfully" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  } catch (error) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};

// Handle preflight OPTIONS
export const optionsHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  };
};