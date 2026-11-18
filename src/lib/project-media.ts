import { statSync } from 'node:fs';
import { join } from 'node:path';
import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>['data'];
type Comparison = NonNullable<Project['comparison']>;

// The first edition selected its built-in samples with the visual field.
const terrain = {
  original: 'media/terrain-original.jpg',
  compressed: 'media/terrain-compressed.jpg',
  alt: '蓝色地形样张上相邻的山脊等高线',
};
const board = { path: 'media/gomoku.webp', alt: '五枚黑子在棋盘上斜向连成一线' };

export function projectMedia(data: Project) {
  const comparison = data.comparison ?? (data.visual === 'imgshift' ? terrain : undefined);
  const sample = comparison && { path: comparison.compressed, alt: comparison.alt };
  const cover = data.cover ?? sample ?? (data.visual === 'gomoku' ? board : undefined);
  return { cover, comparison };
}

export function comparisonSizes(comparison: Comparison) {
  function size(path: string) {
    const bytes = statSync(join(process.cwd(), 'public', path)).size;
    return (bytes / 1024).toFixed(1) + ' KiB';
  }
  return { original: size(comparison.original), compressed: size(comparison.compressed) };
}
