import { getCollection } from 'astro:content';

export async function listProjects(includeDrafts = false) {
  const projects = await getCollection('projects', ({ data }) => includeDrafts || !data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

export async function listNotes(includeDrafts = false) {
  const notes = await getCollection('notes', ({ data }) => includeDrafts || !data.draft);
  return notes.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}
