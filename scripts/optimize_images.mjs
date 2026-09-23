import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('src/assets/images/catalog');
const outputDir = path.resolve('src/assets/images/optimized');

async function optimizeImages() {
  try {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(inputDir);

    let processed = 0;
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of files) {
      if (!file.match(/\.(jpe?g|png|webp)$/i)) continue;

      const inputPath = path.join(inputDir, file);
      const filename = path.parse(file).name;
      const outputPath = path.join(outputDir, `${filename}.webp`);

      const originalStat = await fs.stat(inputPath);
      totalOriginalSize += originalStat.size;

      process.stdout.write(`Оптимизация: ${file}... `);

      // Конвертируем в WebP, ограничиваем ширину 1920px (если больше), качество 80%
      await sharp(inputPath)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      const optimizedStat = await fs.stat(outputPath);
      totalOptimizedSize += optimizedStat.size;

      console.log(`готово (${(optimizedStat.size / 1024).toFixed(1)} KB)`);
      processed++;
    }

    const savedMB = (
      (totalOriginalSize - totalOptimizedSize) /
      1024 /
      1024
    ).toFixed(2);
    console.log(`\nГотово! Оптимизировано: ${processed} шт.`);
    console.log(`Сэкономлено места: ${savedMB} MB`);
  } catch (err) {
    console.error('Ошибка при оптимизации:', err);
  }
}

optimizeImages();
