import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const common = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  category: z.string().min(1),
  draft: z.boolean().default(false),
  cover: z.object({ path: z.string(), alt: z.string() }).optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: common.extend({
    order: z.number().int().nonnegative(),
    stack: z.array(z.string()).default([]),
    repo: z.url().optional(),
    sourceDownload: z.string().optional(),
    visual: z.enum(['imgshift', 'gomoku']).optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: common.extend({
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    attachment: z.string().optional(),
    attachmentLabel: z.string().optional(),
  }),
});

export const collections = { projects, notes };
