// functions/api/send-lead.js
// Cloudflare Pages Function to send contact form leads directly to Telegram

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json().catch(() => ({}));
    const name = (data.name || '').trim();
    const phone = (data.phone || '').trim();
    const message = (data.message || '').trim();

    if (!phone) {
      return new Response(JSON.stringify({ error: 'Пожалуйста, укажите номер телефона' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = (env.TELEGRAM_BOT_TOKEN || '').trim().replace(/\s+/g, '');
    const chatId = (env.TELEGRAM_CHAT_ID || '').trim().replace(/\s+/g, '');

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
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервера' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
