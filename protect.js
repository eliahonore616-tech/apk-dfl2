/* Protège le code de l'application : brouille (obfusque) le script contenu dans index.html.
   Utilisation : node protect.js [chemin/index.html]
   Le fichier est remplacé UNIQUEMENT dans l'espace de construction GitHub : votre dépôt garde le code lisible.
   En cas de problème, l'application est construite sans protection (jamais de blocage).  PROTECT=0 désactive. */
const fs = require('fs');
const file = process.argv[2] || 'index.html';
if (process.env.PROTECT === '0') { console.log('Protection désactivée'); process.exit(0); }
let JO;
try { JO = require('javascript-obfuscator'); } catch (e) { console.log('ATTENTION : javascript-obfuscator absent, application NON protégée'); process.exit(0); }
const html = fs.readFileSync(file, 'utf8');
const re = /<script>([\s\S]*?)<\/script>/;
const m = html.match(re);
if (!m) { console.log('Aucun script à protéger'); process.exit(0); }
try {
  const out = JO.obfuscate(m[1], {
    compact: true, target: 'browser', identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false, renameProperties: false, transformObjectKeys: false,
    controlFlowFlattening: false, deadCodeInjection: false, selfDefending: false, debugProtection: false, disableConsoleOutput: false,
    stringArray: true, stringArrayThreshold: 0.6, stringArrayEncoding: ['base64'], rotateStringArray: true, shuffleStringArray: true, stringArrayWrappersCount: 1,
    splitStrings: false, numbersToExpressions: false, simplify: true, unicodeEscapeSequence: false, log: false
  }).getObfuscatedCode();
  new Function(out); // vérifie seulement que le code obtenu est valide (ne l'exécute pas)
  const safe = out.replace(/<\/script/gi, '<\\/script');
  const banner = '/* © 2026 Elia Kilu Honore. Tous droits réservés. Copie et modification interdites. */';
  fs.writeFileSync(file, html.replace(re, () => '<script>' + banner + safe + '</script>'));
  console.log('Code protégé :', Math.round(m[1].length / 1024), 'Ko ->', Math.round(safe.length / 1024), 'Ko');
} catch (e) { console.log('ATTENTION : protection impossible (' + e.message + '), application NON protégée'); }
