import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Загрузка переменных окружения из .env
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      value = value.trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  }
}

// Fallback: поддержка единого стандарта клиентов ../.surge-token
const parentSurgeTokenPath = path.resolve('../.surge-token');
if ((!process.env.SURGE_LOGIN || !process.env.SURGE_TOKEN) && fs.existsSync(parentSurgeTokenPath)) {
  const tokenContent = fs.readFileSync(parentSurgeTokenPath, 'utf8').trim();
  const [parentLogin, parentToken] = tokenContent.split(':');
  if (parentLogin && parentToken) {
    if (!process.env.SURGE_LOGIN) process.env.SURGE_LOGIN = parentLogin.trim();
    if (!process.env.SURGE_TOKEN) process.env.SURGE_TOKEN = parentToken.trim();
  }
}

const login = process.env.SURGE_LOGIN;
const token = process.env.SURGE_TOKEN;
const domain = process.env.SURGE_DOMAIN || 'moroshkales.com';

if (!token) {
  console.error('❌ Ошибка: переменная окружения SURGE_TOKEN не найдена.');
  console.error('Пожалуйста, укажите SURGE_TOKEN в файле .env или передайте через окружение.');
  process.exit(1);
}

if (!login) {
  console.error('❌ Ошибка: переменная окружения SURGE_LOGIN не найдена.');
  console.error('Пожалуйста, укажите SURGE_LOGIN в файле .env или передайте через окружение.');
  process.exit(1);
}

console.log(`🚀 Деплой Moroshka на Surge: ${domain} (аккаунт: ${login})...`);

const result = spawnSync('npx', ['surge', 'dist', domain, '--token', token], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    SURGE_LOGIN: login,
    SURGE_TOKEN: token,
  },
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}
console.log(`✅ Деплой на Surge успешно завершен!`);
