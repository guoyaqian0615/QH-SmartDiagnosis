import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  knowledgeEntries,
  type KnowledgeEntry,
  type KnowledgeKind,
} from "@/data/knowledge/catalog";
import {
  getKnowledgeStatsFromEntries,
  normalizeKnowledgeText,
  resolveKnowledgeEntryFromEntries,
  searchKnowledgeEntriesFromEntries,
  type KnowledgeFilter,
} from "@/lib/knowledge/search";

type PersistedKnowledgeEntry = KnowledgeEntry & {
  source: "deepseek";
  sourceQuery: string;
  createdAt: number;
  updatedAt: number;
};

type KnowledgeCacheFile = {
  version: 1;
  entries: PersistedKnowledgeEntry[];
};

const KNOWLEDGE_CACHE_PATH = path.join(process.cwd(), "data", "knowledge-generated.json");

function uniqueBySlug(entries: KnowledgeEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.slug)) return false;
    seen.add(entry.slug);
    return true;
  });
}

async function ensureCacheFile() {
  await mkdir(path.dirname(KNOWLEDGE_CACHE_PATH), { recursive: true });
  try {
    await readFile(KNOWLEDGE_CACHE_PATH, "utf8");
  } catch {
    const seed: KnowledgeCacheFile = { version: 1, entries: [] };
    await writeFile(KNOWLEDGE_CACHE_PATH, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readCacheFile(): Promise<KnowledgeCacheFile> {
  await ensureCacheFile();
  const text = await readFile(KNOWLEDGE_CACHE_PATH, "utf8");
  const parsed = JSON.parse(text) as KnowledgeCacheFile;
  return {
    version: 1,
    entries: Array.isArray(parsed.entries) ? parsed.entries : [],
  };
}

async function writeCacheFile(data: KnowledgeCacheFile) {
  await ensureCacheFile();
  await writeFile(KNOWLEDGE_CACHE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function loadGeneratedKnowledgeEntries() {
  const cache = await readCacheFile();
  return cache.entries;
}

export async function loadKnowledgeEntries() {
  const generated = await loadGeneratedKnowledgeEntries();
  return uniqueBySlug([...generated, ...knowledgeEntries]);
}

export async function getKnowledgeEntryBySlugFromRepo(slug?: string | null) {
  if (!slug) return null;
  const entries = await loadKnowledgeEntries();
  return entries.find((entry) => entry.slug === slug) ?? null;
}

export async function searchKnowledgeEntriesFromRepo(options: {
  query?: string;
  kind?: KnowledgeFilter;
}) {
  const entries = await loadKnowledgeEntries();
  return searchKnowledgeEntriesFromEntries(entries, options);
}

export async function resolveKnowledgeEntryFromRepo(options: {
  title: string;
  kind?: KnowledgeKind;
}) {
  const entries = await loadKnowledgeEntries();
  return resolveKnowledgeEntryFromEntries(entries, options);
}

export async function getKnowledgeCatalogPayload() {
  const entries = await loadKnowledgeEntries();
  const featured = entries.filter((entry) => entry.featured).length;
  return {
    entries,
    stats: getKnowledgeStatsFromEntries(entries, featured),
  };
}

function safeAsciiSlug(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return normalized || `entry-${Date.now()}`;
}

async function ensureUniqueSlug(desired: string) {
  const entries = await loadKnowledgeEntries();
  const slugs = new Set(entries.map((entry) => entry.slug));
  if (!slugs.has(desired)) return desired;

  let index = 2;
  let next = `${desired}-${index}`;
  while (slugs.has(next)) {
    index += 1;
    next = `${desired}-${index}`;
  }
  return next;
}

export async function upsertGeneratedKnowledgeEntry(input: {
  entry: KnowledgeEntry;
  sourceQuery: string;
}) {
  const cache = await readCacheFile();
  const sourceQuery = input.sourceQuery.trim();
  const titleMatch = cache.entries.find(
    (entry) => normalizeKnowledgeText(entry.title) === normalizeKnowledgeText(input.entry.title),
  );
  const now = Date.now();

  if (titleMatch) {
    const next: PersistedKnowledgeEntry = {
      ...titleMatch,
      ...input.entry,
      slug: titleMatch.slug,
      source: "deepseek",
      sourceQuery,
      createdAt: titleMatch.createdAt,
      updatedAt: now,
    };
    cache.entries = cache.entries.map((entry) => (entry.slug === titleMatch.slug ? next : entry));
    await writeCacheFile(cache);
    return next;
  }

  const slug = await ensureUniqueSlug(safeAsciiSlug(input.entry.slug || input.entry.title));
  const next: PersistedKnowledgeEntry = {
    ...input.entry,
    slug,
    source: "deepseek",
    sourceQuery,
    createdAt: now,
    updatedAt: now,
  };
  cache.entries.unshift(next);
  await writeCacheFile(cache);
  return next;
}
