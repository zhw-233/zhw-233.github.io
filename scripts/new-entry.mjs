import { readFileSync, writeFileSync } from 'node:fs';

const [kind, slug, ...extra] = process.argv.slice(2);
const folders = { project: 'projects', note: 'notes' };
if (!Object.hasOwn(folders, kind) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '') || slug === 'index' || extra.length) {
  console.error('用法：npm run new:project -- my-tool 或 npm run new:note -- my-note。文件名用小写英文、数字和连字符，index 为目录页保留。');
  process.exit(1);
}

const folder = folders[kind];
const path = 'src/content/' + folder + '/' + slug + '.md';
let markdown = readFileSync('templates/' + kind + '.md', 'utf8');
if (kind === 'note') {
  const today = new Date();
  const date = [today.getFullYear(), today.getMonth() + 1, today.getDate()].map(n => String(n).padStart(2, '0')).join('-');
  markdown = markdown.replace(/^date: .*$/m, 'date: ' + date);
}
try {
  writeFileSync(path, markdown, { flag: 'wx' });
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.error('此文件已存在：' + path);
  process.exit(1);
}
console.log(`已创建 ${path}。启动 npm run dev 后，打开 /${folder}/${slug}/ 预览草稿。`);
