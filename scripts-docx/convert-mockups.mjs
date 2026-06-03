import sharp from 'sharp';

const files = ['mockup-01-login','mockup-02-home','mockup-03-detail','mockup-04-library','mockup-05-chat'];
for (const f of files) {
  await sharp(`./mockups/${f}.svg`).resize(390, 844).png().toFile(`./mockups/${f}.png`);
  console.log(`✅ ${f}.png`);
}
console.log('✅ Conversion terminée');
