# zhw 的个人网站

一个用 Astro 和 Markdown 维护的中文作品集。首页展示代表项目和最近笔记，项目与文章各有固定链接，适合从简历直接指向某个作品。

## 本地使用

进入项目根目录，在终端运行以下命令启动开发预览，打开终端显示的本机地址。当前项目已配好本地依赖。在新电脑或新克隆的工作目录上，先用 Node.js 22.23.4 或更新版本执行一次 `npm ci`。

```sh
npm run dev
```

检查最终的静态页面时运行以下两行。构建结果位于 `dist/`。

```sh
npm run build
npm run preview
```

## 修改个人资料

在 `src/lib/site.ts` 修改署名、GitHub 地址、首页介绍和站点描述。导航与分享信息位于 `src/layouts/SiteLayout.astro`，页面配色和字号在 `src/styles/global.css`。Geist 字体随站点一起加载，中文字体优先使用访客设备上的苹方、思源黑体或微软雅黑。

## 写一篇博客

在 `src/content/notes/` 下新建一个 Markdown 文件。文件名决定文章地址，例如 `first-post.md` 对应 `/notes/first-post/`。已写进简历或分享出去的地址，保留原文件名即可长期使用。

```markdown
---
title: 我的第一篇开发随笔
summary: 这篇文章解决了什么问题。
category: 开发随笔
date: 2026-11-18
tags: [开发记录]
draft: true
---

## 问题是怎么出现的

在这里写下正文。
```

准备好后，把 `draft` 改为 `false`。首页和笔记列表按日期自动更新，正文里的二级标题会生成目录。最新一篇会出现在笔记页首位。可选的 `cover.path` 和 `cover.alt` 用于添加封面，`attachment` 与 `attachmentLabel` 用于提供附件和下载按钮。图片和附件的路径相对于 `public/`，例如 `media/prefix-sum.png` 或 `files/acm-guide.pdf`。

## 增加一个项目

在 `src/content/projects/` 下新建 Markdown。写入 `title`、`summary`、`category`、`stack` 和 `order`，小的排序值在前，前两个项目出现在首页。可选的 `repo` 接受源码仓库链接，`sourceDownload` 接受本地源码包路径。可以用一张自己的图作封面。

```yaml
cover:
  path: media/my-project.webp
  alt: 一句话描述图里的内容
```

项目和笔记都支持 `draft: true`。草稿会同时从列表和详情路由中排除。首页和项目页使用的压缩对照实测值由两张文件的实际大小计算。

## 预览将来的访问路径

默认从域名根路径构建。若之后准备挂在 `/personal-site/` 子路径，可以先在本机验证同样的链接结构。

```sh
BASE_PATH=/personal-site/ npm run build
BASE_PATH=/personal-site/ npm run preview
```

有正式域名后，构建时额外传入 `SITE_URL`，取值为该站点的完整来源地址（协议和域名）。构建器会生成规范链接和分享卡片地址。最终交付给静态托管服务的目录是 `dist/`。

## 首版素材

- 地形图是原创高度场渲染。ImgShift 先以质量 96 生成 JPEG 原图，再用 `zip -q 63 -progressive` 压缩。网页中的滑块直接对照两份输出。
- 五子棋封面是按项目棋盘规则绘制的对局示意图。下载包包含原项目的 `src/main.c`、MinGW 编译脚本和 README。
- ACM 导读的 PDF 来自原题单工程的 `main.pdf`。笔记封面将正文的四项数列绘成了前缀和示意图。
- Geist 字体的授权文本随站点保存在 `public/licenses/Geist-OFL.txt`。
