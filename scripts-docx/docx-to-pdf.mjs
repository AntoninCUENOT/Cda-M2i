import mammoth from 'mammoth';
import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

const files = [
  {
    docx: resolve(__dir, '../documentation/dossier-cda-animetracker.docx'),
    pdf:  resolve(__dir, '../documentation/dossier-cda-animetracker.pdf'),
    title: 'Dossier CDA — AnimeTracker',
  },
];

const browser = await puppeteer.launch({ headless: 'new' });

for (const { docx, pdf, title } of files) {
  console.log(`Conversion : ${title}...`);

  const result = await mammoth.convertToHtml({ path: docx });
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Calibri, 'Segoe UI', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    h1 { font-size: 18pt; color: #1E1B4B; margin-top: 2em; border-bottom: 2px solid #8B5CF6; padding-bottom: 6px; }
    h2 { font-size: 14pt; color: #8B5CF6; margin-top: 1.5em; }
    h3 { font-size: 12pt; color: #1E1B4B; margin-top: 1em; }
    p  { margin: 0.4em 0; }
    ul, ol { margin: 0.3em 0 0.3em 1.5em; }
    li { margin: 0.2em 0; }
    table { width: 100%; border-collapse: collapse; margin: 1em 0; font-size: 10pt; }
    th { background: #1E1B4B; color: #FFFFFF; padding: 6px 8px; text-align: left; }
    td { border: 1px solid #D1D5DB; padding: 5px 8px; }
    tr:nth-child(even) td { background: #F9FAFB; }
    pre, code { font-family: 'Courier New', monospace; font-size: 9pt; background: #F1F5F9; padding: 2px 4px; border-radius: 3px; }
    img { max-width: 100%; height: auto; margin: 0.5em auto; display: block; }
    @page { margin: 2cm 2.5cm; size: A4; }
    @media print {
      h1 { page-break-before: always; }
      h1:first-of-type { page-break-before: avoid; }
      table, img { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  ${result.value}
</body>
</html>`;

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdf,
    format: 'A4',
    margin: { top: '2cm', right: '2.5cm', bottom: '2cm', left: '2.5cm' },
    printBackground: true,
  });
  await page.close();
  console.log(`✅ ${pdf.split('\\').pop()}`);
}

await browser.close();
console.log('Conversion terminée.');
