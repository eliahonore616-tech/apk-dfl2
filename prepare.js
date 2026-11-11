// Exécuté automatiquement après "npm install" : prépare les polices, les modules d'import et la clé de signature.
const fs = require('fs'), path = require('path'), os = require('os');
const root = __dirname;
const web = fs.existsSync(path.join(root, 'www')) ? path.join(root, 'www') : root;
const nm = path.join(root, 'node_modules');

// Fichier d'identité de l'application Android : recréé à chaque construction pour éviter toute erreur de saisie
if (fs.existsSync(path.join(root, 'www'))) {
  fs.writeFileSync(path.join(root, 'capacitor.config.json'), JSON.stringify({ appId: 'cd.interieur.dsfl.agents', appName: 'Gestion Agents DSFL', webDir: 'www' }, null, 2));
  console.log('OK   capacitor.config.json');
}

const copy = (from, to) => { try { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.copyFileSync(from, to); console.log('OK  ', path.basename(to)); } catch (e) { console.log('ECHEC', path.basename(to), e.message); } };
const find = (dir, re) => { try { return fs.readdirSync(dir).filter(f => re.test(f)).map(f => path.join(dir, f)); } catch (e) { return []; } };

// Police Montserrat (variable)
for (const f of find(path.join(nm, '@fontsource-variable', 'montserrat', 'files'), /^montserrat-latin(-ext)?-wght-normal\.woff2$/)) copy(f, path.join(web, 'fonts', path.basename(f)));
// Lecture Excel / Word / PDF
copy(path.join(nm, 'xlsx', 'dist', 'xlsx.full.min.js'), path.join(web, 'lib', 'xlsx.full.min.js'));
for (const f of find(path.join(nm, 'mammoth'), /^mammoth\.browser\.min\.js$/)) copy(f, path.join(web, 'lib', 'mammoth.browser.min.js'));
copy(path.join(nm, 'pdfjs-dist', 'build', 'pdf.min.js'), path.join(web, 'lib', 'pdf.min.js'));
copy(path.join(nm, 'pdfjs-dist', 'build', 'pdf.worker.min.js'), path.join(web, 'lib', 'pdf.worker.min.js'));
// Clé de signature fixe (permet de mettre à jour l'APK sans désinstaller)
const ks = path.join(root, 'debug.keystore');
if (fs.existsSync(ks)) copy(ks, path.join(os.homedir(), '.android', 'debug.keystore'));
