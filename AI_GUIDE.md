# МорошкаЛес — AI Guide

Руководство по структуре проекта и соглашениям для ИИ-ассистентов.

## Стандарты качества

1. **First-Time Right (Без костылей):** Каждое решение должно быть готовым к продакшену с первой попытки без временных заплаток.
2. **Системный анализ:** Перед изменением компонентов учитывать влияние на весь сайт (Lenis smooth scroll, GSAP, Preline UI, верстка).

## Стек и архитектура

- **Стек:** Astro 7, Tailwind v4 (`@tailwindcss/vite`), Preline UI, Lenis (плавный скролл), GSAP.
- **Язык сайта:** Только русский (`ru`).
- **Маршрутизация:** Файловая структура под `src/pages/`.
- **Контент-коллекции:** Описаны в `src/content.config.ts`:
  - `houses` (`src/content/houses/`) — карточки домов для каталога
  - `blog` (`src/content/blog/`) — статьи блога

## Алиасы путей

| Алиас           | Путь                   |
| --------------- | ---------------------- |
| `@/*`           | `src/*`                |
| `@components/*` | `src/components/*`     |
| `@content/*`    | `src/content/*`        |
| `@data/*`       | `src/data_files/*`     |
| `@images/*`     | `src/images/*`         |
| `@scripts/*`    | `src/assets/scripts/*` |
| `@styles/*`     | `src/assets/styles/*`  |
| `@utils/*`      | `src/utils/*`          |

## Команды разработки

- `npm run dev` — запуск локального dev-сервера
- `npm run build` — проверка типов (`astro check`) и сборка (`astro build` + `process-html.mjs`)
- `npm run preview` — просмотр собранного проекта
