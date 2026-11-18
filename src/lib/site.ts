export const site = {
  name: 'zhw233',
  github: 'https://github.com/zhw-233',
  introduction: 'zhw233 的个人网站',
  description: 'zhw233 的个人作品集与笔记',
};

export function sitePath(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return base + '/' + path.replace(/^\/+/, '');
}

export function noteDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
