const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const indexHtmlPath = path.join(buildDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('build/index.html does not exist. Run npm run build first.');
  process.exit(1);
}

const routes = [
  'links',
  'landing',
  'bio',
  'connect',
  'welcome',
  'admin',
  'create-your-ad',
  'bot-for-doctor',
  'services',
  'our-services',
  'about',
  'contact',
  'signin',
  'signup',
  'dashboard',
];

const indexContent = fs.readFileSync(indexHtmlPath, 'utf8');

routes.forEach((route) => {
  const routeDir = path.join(buildDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
  console.log(`Created route fallback: build/${route}/index.html`);
});

// Also ensure 404.html in build is up to date with public/404.html
const public404 = path.join(__dirname, '..', 'public', '404.html');
if (fs.existsSync(public404)) {
  fs.copyFileSync(public404, path.join(buildDir, '404.html'));
  console.log('Synchronized 404.html into build directory.');
}

console.log('All static routes prepared successfully for GitHub Pages!');
