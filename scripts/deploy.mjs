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

const login = process.env.SURGE_LOGIN || 'Julia-xanti@yandex.ru';
const token = process.env.SURGE_TOKEN || '3fb6cfbce4b5d95bcd0f57c2bb526fef';
const domain = process.env.SURGE_DOMAIN || 'moroshkales.surge.sh';

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
