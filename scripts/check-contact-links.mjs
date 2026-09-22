import fs from 'node:fs';

const section = fs.readFileSync(
  'src/components/sections/misc/ContactSection.astro',
  'utf8'
);
const block = fs.readFileSync(
  'src/components/ui/blocks/ContactIconBlock.astro',
  'utf8'
);

const checks = [
  [
    'MAX url',
    section.includes(
      'https://max.ru/u/f9LHodD0cOJZk_s8VSc9OCqBMqGwDRjR6fWRU84gj1nfTuquR8o6BgN9--4'
    ),
  ],
  ['no placeholder "#"', !section.includes('linkURL="#"')],
  ['TG title', section.includes('Написать в Telegram')],
  [
    'no bare @JuliaM85 as link title',
    !section.includes('linkTitle={copy.tgLink}') &&
      !section.includes('linkTitle="@JuliaM85"'),
  ],
  ['target prop supported', block.includes('target')],
  ['noopener rel', section.includes('noopener') || block.includes('noopener')],
  ['external opens new tab', section.includes('_blank')],
  ['orange links', block.includes('text-accent')],
  [
    'phone stays tel dialer',
    section.includes('linkURL="tel:+79825111535"') &&
      !/tel:\+79825111535"[^>]*_blank/.test(section),
  ],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
  if (!ok) failed++;
}
if (failed > 0) {
  console.log(`\n${failed} check(s) failing`);
  process.exit(1);
}
console.log('\nAll contact link checks pass');
