import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { decodeHTMLAttribute } from 'entities';
import { ELEMENT_NODE, parse, walkSync } from 'ultrahtml';

const dist = resolve('dist');
const origin = new URL(process.env.SITE_URL || 'https://preview.invalid').origin;
const base = '/' + (process.env.BASE_PATH || '').split('/').filter(Boolean).join('/');
const mount = base === '/' ? '/' : base + '/';
const files = new Set();
const pages = new Map();

for (const item of readdirSync(dist, { recursive: true, withFileTypes: true })) {
  if (!item.isFile()) continue;
  const file = relative(dist, join(item.parentPath, item.name)).split(sep).join('/');
  files.add(file);
  if (!file.endsWith('.html')) continue;
  const ids = new Set();
  const links = new Set();
  const html = parse(readFileSync(join(dist, file), 'utf8'));
  walkSync(html, node => {
    if (node.type !== ELEMENT_NODE) return;
    const { id, href, src, property, content } = node.attributes;
    if (id) ids.add(decodeHTMLAttribute(id));
    if (href) links.add(decodeHTMLAttribute(href));
    if (src) links.add(decodeHTMLAttribute(src));
    if (property === 'og:image' && content) links.add(decodeHTMLAttribute(content));
  });
  pages.set(file, { ids, links });
}

function checkLink(link, from) {
  const url = new URL(link, from);
  if (url.origin !== origin) return;
  if (url.pathname !== base && !url.pathname.startsWith(mount)) {
    if (/^(https?:)?\/\//i.test(link)) return; // Another site on the same host.
    throw new Error('链接指向站点目录以外');
  }
  const path = decodeURIComponent(url.pathname.slice(mount.length));
  const file = files.has(path) ? path : (path ? path.replace(/\/?$/, '/') : '') + 'index.html';
  if (!files.has(file)) throw new Error('找不到目标文件');
  const fragment = decodeURIComponent(url.hash.slice(1).split(':~:')[0]);
  if (fragment && pages.has(file) && !pages.get(file).ids.has(fragment)) {
    throw new Error('找不到目标标题或锚点');
  }
}

const errors = [];
for (const [file, { links }] of pages) {
  const from = new URL(mount + file.replace(/(^|\/)index\.html$/, '$1'), origin);
  for (const link of links) {
    try {
      checkLink(link, from);
    } catch (error) {
      errors.push(`${file} → ${link}（${error.message}）`);
    }
  }
}
if (!pages.has('index.html')) errors.push('缺少首页 dist/index.html');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`已检查 ${pages.size} 个静态页面的站内链接、锚点与引用文件（${mount}）。`);
}
