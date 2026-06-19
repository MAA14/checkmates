const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL!;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN!;

export async function sendWhatsAppMessage(phone: string, message: string) {
  const res = await fetch(WHATSAPP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone, // format: "628xxxx"
      type: "text",
      text: {
        body: message,
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(error);
    throw new Error("WhatsApp API error: " + error);
  }

  return res.json();
}
