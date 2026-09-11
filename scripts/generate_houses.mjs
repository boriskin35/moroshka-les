import fs from 'fs/promises';
import path from 'path';

const houses = [
  {
    id: 'yasniy-den',
    title: 'Дом-Терраса «Ясный день»',
    area: 32,
    type: 'Дом-трансформер + баня на 1 фундаменте',
    bedrooms: 'студия',
    features: ['эксплуатируемая кровля', 'панорамное остекление', '4,5×7,5 м'],
    image: 'yasniy-den-exterior-1.webp', // Переименовано из page_18_img_2.webp
  },
  {
    id: 'rosa',
    title: 'Дом Роса',
    area: 31.7,
    type: 'Дом + баня на 1 фундаменте',
    bedrooms: 'студия',
    features: ['панорамное остекление', '4,5×6 м'],
    image: 'rosa-exterior-1.webp',
  },
  {
    id: 'opushka',
    title: 'Дом Опушка',
    area: 36,
    type: 'Одноэтажный каркасный, кедр',
    bedrooms: '1',
    features: ['компактный', 'кухня-гостиная 29 м²'],
    image: 'opushka-exterior-1.webp',
  },
  {
    id: 'ladniy',
    title: 'Ладный дом',
    area: 66.7,
    type: 'Одноэтажный, флагман линейки',
    bedrooms: '2',
    features: ['брёвна кедра', 'держит тепло при −40°C', 'сборка от 10 дней'],
    image: 'ladniy-exterior-1.webp',
  },
  {
    id: 'zhivica',
    title: 'Дом-Баня Живица',
    area: 81,
    type: 'Капитальный дом-баня',
    bedrooms: '—',
    features: ['сэндвич-панели 200 мм', 'парная', 'душевая', 'зона отдыха'],
    image: 'zhivica-exterior-1.webp',
  },
  {
    id: 'usadba',
    title: 'Дом Усадьба',
    area: 111,
    type: 'Одноэтажный жилой',
    bedrooms: '2 + гардеробные',
    features: ['усиленный каркас', 'сэндвич-панели 200 мм'],
    image: 'usadba-exterior-1.webp',
  },
  {
    id: 'sibirsky-prostor',
    title: 'Сибирский простор',
    area: 162,
    type: 'Коммерческое здание',
    bedrooms: '—',
    features: ['зал на 50–60 гостей', 'для ресторанного/ивент-бизнеса'],
    image: 'sibirskiy-prostor-exterior-1.webp',
  },
];

const targetDir = path.resolve('src/content/houses');

async function createHouses() {
  await fs.mkdir(targetDir, { recursive: true });

  for (const house of houses) {
    const content = `---
title: "${house.title}"
description: "${house.type}. Площадь: ${house.area} м². Спальни: ${house.bedrooms}"
area: ${house.area}
type: "${house.type}"
bedrooms: "${house.bedrooms}"
features:
${house.features.map(f => `  - "${f}"`).join('\n')}
mainImage: "@/assets/images/optimized/${house.image}"
imageAlt: "Фасад: ${house.title}"
---

### ${house.title}
Премиальный модульный дом заводского качества сборки. Идеально подходит для комфортного проживания.
- **Площадь:** ${house.area} м²
- **Тип:** ${house.type}
- **Утепление:** 200 мм (минвата/базальт), тройные стеклопакеты.
- **Особенности:** ${house.features.join(', ')}.

Мы гарантируем сборку на участке от 10 дней! Без щелей, усадки и скрытых расходов.
`;

    await fs.writeFile(
      path.join(targetDir, `${house.id}.md`),
      content,
      'utf-8'
    );
    console.log(`Created ${house.id}.md`);
  }
}

createHouses();
