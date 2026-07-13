const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const safeText = (value, maxLength) => String(value || '').trim().slice(0, maxLength);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ message: 'Método no permitido.' });
  }

  const contentType = request.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return response.status(415).json({ message: 'Formato de solicitud no compatible.' });
  }

  const body = request.body || {};
  if (safeText(body.website, 200)) {
    return response.status(200).json({ ok: true });
  }

  const lead = {
    name: safeText(body.name, 120),
    company: safeText(body.company, 160),
    email: safeText(body.email, 180).toLowerCase(),
    phone: safeText(body.phone, 80),
    area: safeText(body.area, 120),
    message: safeText(body.message, 1800),
    consent: body.consent === 'yes',
    source: 'telvoice.ai',
    submittedAt: new Date().toISOString()
  };

  if (
    lead.name.length < 2 ||
    lead.company.length < 2 ||
    !EMAIL_PATTERN.test(lead.email) ||
    !lead.area ||
    lead.message.length < 20 ||
    !lead.consent
  ) {
    return response.status(400).json({ message: 'La información enviada está incompleta o no es válida.' });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return response.status(503).json({
      message: 'El canal de contacto todavía no está configurado. Intenta nuevamente más tarde.'
    });
  }

  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CONTACT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}` }
          : {})
      },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000)
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook responded with ${webhookResponse.status}`);
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact webhook failed', {
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    return response.status(502).json({ message: 'No fue posible procesar la solicitud en este momento.' });
  }
}
