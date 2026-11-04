<?php
/**
 * Обработчик формы обратной связи для сайта moroshkales.com
 * Локализация: сервер в РФ (Reg.ru) — полное соответствие 152-ФЗ.
 * Доставка: Яндекс.Почта (хозяйке) + Telegram-бот.
 */

// Заголовки ответа
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Разрешаем только POST-запросы
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Конфигурация доставки
$toEmail = getenv('CONTACT_EMAIL') ?: 'Julia-xanti@yandex.ru';
$tgBotToken = getenv('TELEGRAM_BOT_TOKEN') ?: '8879130504:AAEUs1812c7KIObX4nn7iF2_9CJlyJmguYE';
$tgChatId = getenv('TELEGRAM_CHAT_ID') ?: '-1004302482426';

// Получение входных данных (JSON или form-urlencoded)
$rawInput = file_get_contents('php://input');
$inputData = json_decode($rawInput, true);
if (!is_array($inputData)) {
    $inputData = $_POST;
}

// Защита от спам-ботов: honeypot (скрытое поле)
if (!empty($inputData['hp_field'])) {
    // Тихо возвращаем успех боту, ничего не отправляя
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

// Валидация и санитизация
$name = isset($inputData['name']) ? trim((string)$inputData['name']) : '';
$phone = isset($inputData['phone']) ? trim((string)$inputData['phone']) : '';
$message = isset($inputData['message']) ? trim((string)$inputData['message']) : '';

// Очистка от тегов и ограничение длины
$name = mb_substr(strip_tags($name), 0, 100);
$phone = mb_substr(strip_tags($phone), 0, 40);
$message = mb_substr(strip_tags($message), 0, 3000);

if (empty($phone)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Пожалуйста, укажите номер телефона.'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Часовой пояс ХМАО (Ханты-Мансийск, UTC+5)
date_default_timezone_set('Asia/Yekaterinburg');
$dateTimeStr = date('d.m.Y H:i');

// 1. Отправка в Telegram
$tgSuccess = false;
if (!empty($tgBotToken) && !empty($tgChatId)) {
    $safeTgName = htmlspecialchars($name ?: 'Не указано', ENT_QUOTES, 'UTF-8');
    $safeTgPhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $safeTgMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    $tgLines = [
        '🌲 <b>Новая заявка с сайта МорошкаЛес</b>',
        '',
        "👤 <b>Имя:</b> {$safeTgName}",
        "📞 <b>Телефон:</b> <code>{$safeTgPhone}</code>",
    ];

    if (!empty($safeTgMessage)) {
        $tgLines[] = "💬 <b>Суть вопроса:</b>\n{$safeTgMessage}";
    }

    $tgLines[] = '';
    $tgLines[] = "🕒 <i>{$dateTimeStr} (ХМАО)</i>";
    $tgText = implode("\n", $tgLines);

    $tgPayload = json_encode([
        'chat_id' => $tgChatId,
        'text' => $tgText,
        'parse_mode' => 'HTML',
        'disable_web_page_preview' => true,
    ]);

    $tgUrl = "https://api.telegram.org/bot{$tgBotToken}/sendMessage";

    if (function_exists('curl_init')) {
        $ch = curl_init($tgUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $tgPayload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
        $res = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $tgSuccess = ($code === 200);
    } else {
        $opts = [
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => $tgPayload,
                'timeout' => 10,
            ],
        ];
        $context = stream_context_create($opts);
        $res = @file_get_contents($tgUrl, false, $context);
        $tgSuccess = ($res !== false);
    }
}

// 2. Отправка на Яндекс.Почту хозяйке
$mailSuccess = false;
if (!empty($toEmail)) {
    $subjectText = 'Новая заявка МорошкаЛес: ' . ($name ?: $phone);
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';

    $safeHtmlName = htmlspecialchars($name ?: 'Не указано', ENT_QUOTES, 'UTF-8');
    $safeHtmlPhone = htmlspecialchars($phone, ENT_QUOTES, 'UTF-8');
    $phoneDigits = preg_replace('/[^\d+]/', '', $phone);
    $safeHtmlMessage = nl2br(htmlspecialchars($message ?: 'Не указано', ENT_QUOTES, 'UTF-8'));

    $emailBody = <<<HTML
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Новая заявка МорошкаЛес</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f7f9f6; color: #222222; margin: 0; padding: 24px;">
  <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.04);">
    <div style="background-color: #133E22; padding: 20px 24px; color: #ffffff;">
      <h2 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px;">🌲 МорошкаЛес — Новая заявка</h2>
    </div>
    <div style="padding: 24px;">
      <p style="margin: 0 0 16px 0; font-size: 15px; color: #4a5568;">
        Поступила новая заявка с формы на сайте <a href="https://moroshkales.com" target="_blank" style="color: #F25E1E; text-decoration: none; font-weight: bold;">moroshkales.com</a>:
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; color: #718096; width: 140px; vertical-align: top;">Имя:</td>
          <td style="padding: 12px 0; color: #1a202c; font-weight: bold;">{$safeHtmlName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; color: #718096; vertical-align: top;">Телефон:</td>
          <td style="padding: 12px 0; font-size: 17px; font-weight: bold;">
            <a href="tel:{$phoneDigits}" style="color: #133E22; text-decoration: none; border-bottom: 2px solid #F25E1E;">{$safeHtmlPhone}</a>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; color: #718096; vertical-align: top;">Вопрос / детали:</td>
          <td style="padding: 12px 0; color: #1a202c; line-height: 1.5;">{$safeHtmlMessage}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #718096; vertical-align: top;">Время заявки:</td>
          <td style="padding: 12px 0; color: #718096; font-size: 13px;">{$dateTimeStr} (ХМАО)</td>
        </tr>
      </table>
    </div>
    <div style="background-color: #f8fafc; padding: 14px 24px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #a0aec0; text-align: center;">
      Письмо сформировано сервером сайта moroshkales.com на хостинге Reg.ru (РФ).
    </div>
  </div>
</body>
</html>
HTML;

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: =?UTF-8?B?' . base64_encode('Сайт МорошкаЛес') . '?= <no-reply@moroshkales.com>',
        'X-Mailer: PHP/' . phpversion(),
    ];

    $mailSuccess = @mail($toEmail, $encodedSubject, $emailBody, implode("\r\n", $headers));
}

// Заявка считается принятой, если сработал хотя бы один из каналов доставки
if ($tgSuccess || $mailSuccess) {
    echo json_encode(['ok' => true, 'message' => 'Заявка успешно принята'], JSON_UNESCAPED_UNICODE);
} else {
    // Если оба канала вернули сбой
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Ошибка при отправке заявки. Пожалуйста, свяжитесь с нами по телефону.'], JSON_UNESCAPED_UNICODE);
}
