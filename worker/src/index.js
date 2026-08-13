const allowedOrigins = new Set([
  "https://twoinstudio.com",
  "https://www.twoinstudio.com",
  "http://localhost:8001",
]);

const services = new Set([
  "品牌官網", "Landing Page", "銷售頁與 Funnel", "客製化網站系統", "還不確定，想先討論",
  "Company Website", "Sales Page & Funnel", "Custom Web System", "Not sure yet — let's discuss",
]);

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character]);
}

function extractEmail(value) {
  const match = value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : null;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const url = new URL(request.url);

    if (!allowedOrigins.has(origin)) return json({ ok: false, error: "Origin not allowed" }, 403, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST" || url.pathname !== "/submit") {
      return json({ ok: false, error: "Not found" }, 404, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid JSON" }, 400, origin);
    }

    // Bots often fill fields hidden from human visitors.
    if (clean(payload.website, 200)) return json({ ok: true }, 200, origin);

    const name = clean(payload.name, 100);
    const contact = clean(payload.contact, 200);
    const service = clean(payload.service, 100);
    const message = clean(payload.message, 3000);
    const language = payload.language === "en" ? "en" : "zh";

    if (!name || !contact || !message || !services.has(service)) {
      return json({ ok: false, error: "Missing or invalid fields" }, 400, origin);
    }

    const subject = language === "en" ? `TWOIN project inquiry: ${service}` : `TWOIN 網站需求：${service}`;
    const replyTo = extractEmail(contact);
    const text = [
      `Name / 姓名: ${name}`, `Contact / 聯絡方式: ${contact}`, `Service / 服務: ${service}`,
      `Language / 語言: ${language}`, "", "Project details / 需求描述:", message,
    ].join("\n");
    const html = `<h2>New TWOIN project inquiry</h2>
      <p><strong>Name / 姓名:</strong> ${escapeHtml(name)}</p>
      <p><strong>Contact / 聯絡方式:</strong> ${escapeHtml(contact)}</p>
      <p><strong>Service / 服務:</strong> ${escapeHtml(service)}</p>
      <p><strong>Language / 語言:</strong> ${language}</p><hr>
      <p><strong>Project details / 需求描述:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;

    const emailPayload = { from: env.CONTACT_FROM, to: [env.CONTACT_TO], subject, text, html };
    if (replyTo) emailPayload.reply_to = replyTo;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "twoin-contact-worker/1.0",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resendResponse.ok) {
      console.error("Resend error", resendResponse.status, await resendResponse.text());
      return json({ ok: false, error: "Email delivery failed" }, 502, origin);
    }

    return json({ ok: true }, 200, origin);
  },
};
