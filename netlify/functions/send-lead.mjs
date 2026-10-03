// netlify/functions/send-lead.mjs
// Serverless function to send contact form leads directly to Telegram

async function handleSendLead(data) {
  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  const message = (data.message || '').trim();

  if (!phone) {
    return new Response(JSON.stringify({ error: 'Пожалуйста, укажите номер телефона' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim().replace(/\s+/g, '');
  const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim().replace(/\s+/g, '');

  if (!token || !chatId) {
    console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured');
    return new Response(
      JSON.stringify({ error: 'Переменные окружения Telegram не настроены' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const escapeHtml = str =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const now = new Date().toLocaleString('ru-RU', {
    timeZone: 'Asia/Yekaterinburg',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines = [
    '🌲 <b>Новая заявка с сайта МорошкаЛес</b>',
    '',
    `👤 <b>Имя:</b> ${escapeHtml(name || 'Не указано')}`,
    `📞 <b>Телефон:</b> <code>${escapeHtml(phone)}</code>`,
  ];

  if (message) {
    lines.push(`💬 <b>Суть вопроса:</b> ${escapeHtml(message)}`);
  }

  lines.push('', `🕒 <i>${now} (ХМАО)</i>`);

  const text = lines.join('\n');

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  const tgData = await tgRes.json();
  if (!tgData.ok) {
    console.error('Telegram API error:', tgData);
    return new Response(
      JSON.stringify({ error: 'Ошибка при отправке в Telegram' }),
      {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Netlify Functions v2 (standard)
export default async (req, context) => {
  if (req instanceof Request) {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const data = await req.json();
      return await handleSendLead(data);
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Неверный JSON в теле запроса' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // Fallback for Netlify Functions v1 (req is event)
  const event = req;
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const res = await handleSendLead(data);
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: await res.text(),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Неверный JSON в теле запроса' }),
    };
  }
};

// Also export named handler for Netlify Functions v1 compatibility
export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const res = await handleSendLead(data);
    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: await res.text(),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Неверный JSON в теле запроса' }),
    };
  }
};
