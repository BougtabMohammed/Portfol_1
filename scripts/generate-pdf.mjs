/**
 * Génère les PDF du CV depuis les pages /cv et /en/resume.
 *
 * Le PDF n'est pas maintenu à part : il est imprimé depuis le site, avec la
 * feuille `@media print` de `app/globals.css`. Conséquence utile — corriger une
 * expérience dans `content/data/` met à jour le site ET le PDF, et les deux ne
 * peuvent pas diverger.
 *
 * Usage :  npm run build && npm run pdf
 */
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4390;
const BASE = `http://localhost:${PORT}`;

const server = spawn('npx', ['--yes', 'serve@14', 'out', '-p', String(PORT), '--no-clipboard'], {
  stdio: 'ignore',
  detached: true,
});

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {
      // Le serveur n'écoute pas encore.
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Le serveur statique n'a pas démarré sur le port ${PORT}`);
}

try {
  await waitForServer();

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const targets = [
    [`${BASE}/cv/`, 'public/cv-mohammed-bougtab.pdf'],
    [`${BASE}/en/resume/`, 'public/resume-mohammed-bougtab-en.pdf'],
  ];

  for (const [url, out] of targets) {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: false,
      margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
    });
    console.log('généré :', out);
  }

  await browser.close();
} finally {
  process.kill(-server.pid);
}
