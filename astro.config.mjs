import { satteri } from '@astrojs/markdown-satteri';
import { defineConfig } from 'astro/config';

const prefix = (process.env.BASE_PATH || '').split('/').filter(Boolean).join('/');
const base = prefix ? '/' + prefix : '/';

// Authors can link to /projects/... or /media/... even on a Pages project site.
const siteLinks = {
  name: 'site-relative-links',
  element: {
    filter: ['a', 'img'],
    visit(node, context) {
      const attribute = node.tagName === 'a' ? 'href' : 'src';
      const url = node.properties[attribute];
      if (typeof url === 'string' && url.startsWith('/') && !url.startsWith('//')) {
        context.setProperty(node, attribute, base + url);
      }
    },
  },
};

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || undefined,
  base,
  trailingSlash: 'always',
  markdown: { processor: satteri({ hastPlugins: prefix ? [siteLinks] : [] }) },
  devToolbar: { enabled: false },
});
