import {
  featuredKnowledgeEntries,
  knowledgeEntries,
  knowledgeEntriesBySlug,
  knowledgeKindLabels,
  type KnowledgeEntry,
  type KnowledgeKind,
} from "@/data/knowledge/catalog";

export type KnowledgeFilter = KnowledgeKind | "all";

const kindOrder: KnowledgeFilter[] = ["all", "term", "syndrome", "formula", "herb"];

export function normalizeKnowledgeText(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").trim();
}

function stripFormulaDecorators(value: string) {
  return normalizeKnowledgeText(
    value
      .replace(/方意示意/g, "")
      .replace(/[·•]/g, " ")
      .replace(/加减/g, "")
      .replace(/化裁/g, "")
      .replace(/意/g, ""),
  );
}

function splitTokens(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/\s+/).filter(Boolean);
  return parts.length ? parts : [trimmed];
}

function entrySearchCorpus(entry: KnowledgeEntry) {
  return normalizeKnowledgeText(
    [
      entry.title,
      ...(entry.aliases ?? []),
      entry.summary,
      ...(entry.tags ?? []),
      ...(entry.sections?.flatMap((section) => [section.title, ...section.points]) ?? []),
      ...(entry.relations?.flatMap((relation) => [relation.label, relation.relation]) ?? []),
    ].join(" "),
  );
}

function scoreEntry(entry: KnowledgeEntry, query: string) {
  const normalizedQuery = normalizeKnowledgeText(query);
  if (!normalizedQuery) return entry.featured ? 2 : 1;

  const corpus = entrySearchCorpus(entry);
  const title = normalizeKnowledgeText(entry.title);
  const aliases = (entry.aliases ?? []).map(normalizeKnowledgeText);
  const tags = (entry.tags ?? []).map(normalizeKnowledgeText);
  const tokens = splitTokens(normalizedQuery).map(normalizeKnowledgeText);

  let score = 0;
  if (title === normalizedQuery) score += 120;
  if (title.includes(normalizedQuery)) score += 60;
  if (aliases.some((item) => item === normalizedQuery)) score += 54;
  if (aliases.some((item) => item.includes(normalizedQuery))) score += 30;
  if (tags.some((item) => item.includes(normalizedQuery))) score += 18;

  for (const token of tokens) {
    if (title.includes(token)) score += 18;
    if (aliases.some((item) => item.includes(token))) score += 14;
    if (tags.some((item) => item.includes(token))) score += 10;
    if (corpus.includes(token)) score += 8;
  }

  return score;
}

function compareEntries(a: KnowledgeEntry, b: KnowledgeEntry) {
  const aKind = kindOrder.indexOf(a.kind);
  const bKind = kindOrder.indexOf(b.kind);
  if (aKind !== bKind) return aKind - bKind;
  return a.title.localeCompare(b.title, "zh-CN");
}

export function searchKnowledgeEntriesFromEntries(
  entries: KnowledgeEntry[],
  options: {
    query?: string;
    kind?: KnowledgeFilter;
  },
) {
  const query = options.query?.trim() ?? "";
  const kind = options.kind ?? "all";
  const base = kind === "all" ? entries : entries.filter((entry) => entry.kind === kind);

  if (!query) {
    return [...base].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return compareEntries(a, b);
    });
  }

  return base
    .map((entry) => ({ entry, score: scoreEntry(entry, query) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      if (a.entry.featured !== b.entry.featured) return a.entry.featured ? -1 : 1;
      return compareEntries(a.entry, b.entry);
    })
    .map((item) => item.entry);
}

export function resolveKnowledgeEntryFromEntries(
  entries: KnowledgeEntry[],
  options: {
    title: string;
    kind?: KnowledgeKind;
  },
) {
  const rawTitle = options.title.trim();
  if (!rawTitle) return null;

  const normalizedTitle = normalizeKnowledgeText(rawTitle);
  const normalizedFormulaTitle = stripFormulaDecorators(rawTitle);
  const scope = options.kind ? entries.filter((entry) => entry.kind === options.kind) : entries;

  const exact = scope.find((entry) => normalizeKnowledgeText(entry.title) === normalizedTitle);
  if (exact) return exact;

  const aliasHit = scope.find((entry) =>
    (entry.aliases ?? []).some((alias) => normalizeKnowledgeText(alias) === normalizedTitle),
  );
  if (aliasHit) return aliasHit;

  if (options.kind === "formula") {
    const formulaHit = scope.find((entry) => {
      const title = stripFormulaDecorators(entry.title);
      const aliases = (entry.aliases ?? []).map(stripFormulaDecorators);
      return (
        title === normalizedFormulaTitle ||
        normalizedFormulaTitle.includes(title) ||
        title.includes(normalizedFormulaTitle) ||
        aliases.some(
          (alias) =>
            alias === normalizedFormulaTitle ||
            normalizedFormulaTitle.includes(alias) ||
            alias.includes(normalizedFormulaTitle),
        )
      );
    });
    if (formulaHit) return formulaHit;
  }

  return (
    scope.find((entry) => normalizeKnowledgeText(entry.title).includes(normalizedTitle)) ??
    scope.find((entry) =>
      (entry.aliases ?? []).some((alias) => normalizeKnowledgeText(alias).includes(normalizedTitle)),
    ) ??
    null
  );
}

export function getKnowledgeEntryBySlug(slug?: string | null) {
  if (!slug) return null;
  return knowledgeEntriesBySlug[slug] ?? null;
}

export function resolveKnowledgeEntry(options: {
  title: string;
  kind?: KnowledgeKind;
}) {
  return resolveKnowledgeEntryFromEntries(knowledgeEntries, options);
}

export function resolveKnowledgeHref(options: {
  title: string;
  kind?: KnowledgeKind;
}) {
  const entry = resolveKnowledgeEntry(options);
  return entry ? `/knowledge/${entry.slug}` : null;
}

export function getKnowledgeEntriesByKind(kind: KnowledgeFilter) {
  return kind === "all" ? knowledgeEntries : knowledgeEntries.filter((entry) => entry.kind === kind);
}

export function getKnowledgeEntriesByKindFromEntries(entries: KnowledgeEntry[], kind: KnowledgeFilter) {
  return kind === "all" ? entries : entries.filter((entry) => entry.kind === kind);
}

export function getFeaturedKnowledgeEntries(limit = 4) {
  return featuredKnowledgeEntries.slice(0, limit);
}

export function getKnowledgeStats() {
  return getKnowledgeStatsFromEntries(knowledgeEntries, featuredKnowledgeEntries.length);
}

export function getKnowledgeStatsFromEntries(entries: KnowledgeEntry[], featuredCount?: number) {
  return {
    total: entries.length,
    featured: featuredCount ?? entries.filter((entry) => entry.featured).length,
    kinds: {
      all: entries.length,
      term: entries.filter((entry) => entry.kind === "term").length,
      syndrome: entries.filter((entry) => entry.kind === "syndrome").length,
      formula: entries.filter((entry) => entry.kind === "formula").length,
      herb: entries.filter((entry) => entry.kind === "herb").length,
    },
  };
}

export function paginateKnowledgeEntries(entries: KnowledgeEntry[], page: number, pageSize: number) {
  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = entries.slice(start, start + pageSize);

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

export { knowledgeEntries, knowledgeKindLabels };
