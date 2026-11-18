export const site = {
  name: 'zhw',
  github: 'https://github.com/zhw-233',
  introduction: '我用 C/C++ 和 Python 做图像工具、写小游戏，也把竞赛算法整理成可以跟着练的笔记。',
  description: 'zhw 的个人作品集与笔记。用 C/C++ 和 Python 做图像工具与小游戏，记录算法竞赛中的思路与实现。',
};

export function sitePath(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return base + '/' + path.replace(/^\/+/, '');
}

export function noteDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
