import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(scriptDir, '..');
const sourceDir = resolve(projectDir, '../web/public/games-static/bhava-smriti');
const webDir = resolve(projectDir, 'www');

await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });

for (const file of ['game.js', 'style.css', 'bhava-responsive.css']) {
  await cp(resolve(sourceDir, file), resolve(webDir, file));
}
await cp(resolve(projectDir, 'assets/smriti-memory-match.png'), resolve(webDir, 'smriti-art.png'));
await cp(resolve(projectDir, 'branding.css'), resolve(webDir, 'branding.css'));
await cp(resolve(projectDir, '../web/public/privacy-policy.html'), resolve(webDir, 'privacy-policy.html'));

let html = await readFile(resolve(sourceDir, 'index.html'), 'utf8');
html = html
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '')
  .replace(/^\s*<!-- MEDHAA-SEO(?:-EXTRA)?-INJECTED -->\s*$/gm, '')
  .replace(/^\s*<meta (?:property="(?:og:|twitter:)[^"]*"|name="(?:description|twitter:card)")[^>]*>\s*$/gm, '')
  .replace(/^\s*<link rel="canonical"[^>]*>\s*$/gm, '')
  .replace(/<title>[\s\S]*?<\/title>/i, '<title>Smṛti</title>')
  .replace(/^\s*<script src="(?:bhava-bridge\.js|\.\.\/bhava-session\.js|\.\.\/bhava-game-nav\.js|bhava-responsive\.js)"><\/script>\s*$/gm, '')
  .replace(/<script>document\.title = "Medhā-smṛti";<\/script>\s*/g, '')
  .replace(/<div class="logo">[\s\S]*?<\/div>/, '<div class="logo" aria-hidden="true"></div>')
  .replace('<h1>Medhā-smṛti</h1>', '<h1>Smṛti</h1>')
  .replace('<section class="hero" id="heroBox">', '<section class="hero" id="heroBox"><img class="smriti-title-art" src="smriti-art.png" alt="Smṛti memory-match artwork">')
  .replace('</head>', '  <link rel="stylesheet" href="branding.css">\n</head>')
  .replace('</body>', '  <footer class="brand-credit">By Bhāva Tech · <a href="privacy-policy.html">Privacy policy</a></footer>\n</body>');

await writeFile(resolve(webDir, 'index.html'), html);
console.log(`Prepared standalone game bundle at ${webDir}`);
