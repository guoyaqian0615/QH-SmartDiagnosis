import type { KnowledgeEntry, KnowledgeKind, KnowledgeRelation } from "@/data/knowledge/catalog";
import { requestDeepSeekJson } from "@/lib/clinical/deepseek-client";
import {
  loadKnowledgeEntries,
  resolveKnowledgeEntryFromRepo,
  upsertGeneratedKnowledgeEntry,
} from "@/lib/knowledge/repository";

type KnowledgeDraftRelation = {
  title: string;
  kind: KnowledgeKind;
  relation: string;
};

type KnowledgeDraft = {
  slug?: string;
  kind: KnowledgeKind;
  title: string;
  aliases?: string[];
  summary: string;
  facts?: Array<{ label: string; value: string }>;
  sections?: Array<{ title: string; points: string[] }>;
  tags?: string[];
  relations?: KnowledgeDraftRelation[];
};

function uniqueItems(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function cleanDraft(draft: KnowledgeDraft): KnowledgeDraft {
  return {
    slug: typeof draft.slug === "string" ? draft.slug.trim() : undefined,
    kind: draft.kind,
    title: draft.title.trim(),
    aliases: uniqueItems(Array.isArray(draft.aliases) ? draft.aliases : []).slice(0, 5),
    summary: draft.summary.trim(),
    facts: (Array.isArray(draft.facts) ? draft.facts : [])
      .map((fact) => ({
        label: typeof fact?.label === "string" ? fact.label.trim() : "",
        value: typeof fact?.value === "string" ? fact.value.trim() : "",
      }))
      .filter((fact) => fact.label && fact.value)
      .slice(0, 4),
    sections: (Array.isArray(draft.sections) ? draft.sections : [])
      .map((section) => ({
        title: typeof section?.title === "string" ? section.title.trim() : "",
        points: uniqueItems(Array.isArray(section?.points) ? section.points : []).slice(0, 4),
      }))
      .filter((section) => section.title && section.points.length > 0)
      .slice(0, 3),
    tags: uniqueItems(Array.isArray(draft.tags) ? draft.tags : []).slice(0, 5),
    relations: (Array.isArray(draft.relations) ? draft.relations : [])
      .map((relation) => ({
        title: typeof relation?.title === "string" ? relation.title.trim() : "",
        kind: relation?.kind,
        relation: typeof relation?.relation === "string" ? relation.relation.trim() : "",
      }))
      .filter((relation): relation is KnowledgeDraftRelation =>
        Boolean(
          relation.title &&
            relation.relation &&
            ["term", "syndrome", "formula", "herb"].includes(relation.kind),
        ),
      )
      .slice(0, 5),
  };
}

function ensureUsableDraft(draft: KnowledgeDraft, query: string): KnowledgeDraft {
  const summary = draft.summary || `${query}是中医知识体系中常见的相关条目，可用于帮助理解智诊结果中的概念、证候或调理方向。`;
  const facts =
    draft.facts && draft.facts.length >= 2
      ? draft.facts
      : [
          { label: "条目定位", value: `围绕“${draft.title || query}”建立的知识解释卡，用于配合智诊结果阅读。` },
          { label: "使用场景", value: "适合从问诊结果、方意说明或药材跳转中查看。" },
        ];
  const sections =
    draft.sections && draft.sections.length >= 1
      ? draft.sections
      : [
          {
            title: "基础理解",
            points: [
              `${draft.title || query}通常用于帮助解释中医问诊中的相关判断，不应孤立脱离症状上下文理解。`,
              "阅读该条目时，建议结合主诉、证候和治则一起看，而不是只看名词本身。",
            ],
          },
          {
            title: "在系统中的作用",
            points: [
              "该条目优先服务于智诊结果解释层，帮助用户理解系统为什么给出某个方向。",
              "若后续补充了更多四诊或体质信息，对它的理解也可能更完整。",
            ],
          },
        ];

  return {
    ...draft,
    summary,
    facts,
    sections,
  };
}

async function resolveDraftRelations(relations: KnowledgeDraftRelation[]): Promise<KnowledgeRelation[]> {
  const allEntries = await loadKnowledgeEntries();

  return (
    await Promise.all(
      relations.map(async (relation) => {
        const target =
          allEntries.find(
            (entry) =>
              entry.kind === relation.kind &&
              (entry.title === relation.title || (entry.aliases ?? []).includes(relation.title)),
          ) ??
          (await resolveKnowledgeEntryFromRepo({
            title: relation.title,
            kind: relation.kind,
          }));

        if (!target) return null;
        return {
          slug: target.slug,
          kind: target.kind,
          label: target.title,
          relation: relation.relation,
        } satisfies KnowledgeRelation;
      }),
    )
  ).filter((item): item is KnowledgeRelation => Boolean(item));
}

function buildKnowledgeGenerationMessages(query: string) {
  return [
    {
      role: "system",
      content: [
        "你是中医知识库补全助手。",
        "你的任务是把用户查询转成适合入库的结构化知识卡，不要写成闲聊回答。",
        "输出必须是 JSON 对象，不要输出 markdown，不要输出额外解释。",
        "字段固定为：slug, kind, title, aliases, summary, facts, sections, tags, relations。",
        "kind 只能是 term, syndrome, formula, herb 之一。",
        "title 使用中文；slug 使用小写英文或拼音 kebab-case。",
        "summary 控制在 40~90 个中文字符，适合卡片摘要。",
        "facts 必须提供 2~4 条简短键值对，不允许留空。",
        "sections 必须提供 2 个以上段落，每段 2~4 条短句要点，不允许留空。",
        "relations 中每项只保留 title, kind, relation，relation 用简短中文，如“常见对应证候”“常见药材”“常见方意”。",
        "内容要适合中医知识库解释层，不要提供处方剂量，不要替代医疗建议，不要写过度绝对化表述。",
      ].join("\n"),
    },
    {
      role: "user",
      content: JSON.stringify({
        query,
        target: "为岐黄智诊知识库补全一个可长期复用、可被智诊结果跳转引用的结构化条目",
      }),
    },
  ] as const;
}

export async function lookupOrGenerateKnowledgeEntry(query: string) {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("知识查询不能为空");
  }

  const local = await resolveKnowledgeEntryFromRepo({ title: trimmed });
  const localComplete = Boolean(local?.summary && (local.facts?.length ?? 0) >= 2 && (local.sections?.length ?? 0) >= 1);
  if (local && localComplete) {
    return {
      entry: local,
      source: "local" as const,
      created: false,
    };
  }

  const { data, model } = await requestDeepSeekJson<KnowledgeDraft>(
    buildKnowledgeGenerationMessages(trimmed) as never,
  );

  const draft = ensureUsableDraft(cleanDraft(data), trimmed);
  if (!draft.title || !draft.summary || !draft.kind) {
    throw new Error("DeepSeek 返回的知识卡结构不完整");
  }

  const entry: KnowledgeEntry = {
    id: `generated-${draft.slug || draft.title}-${Date.now()}`,
    slug: draft.slug?.trim() || draft.title.trim(),
    kind: draft.kind,
    title: draft.title,
    aliases: draft.aliases?.length ? draft.aliases : undefined,
    summary: draft.summary,
    facts: draft.facts?.length ? draft.facts : undefined,
    sections: draft.sections?.length ? draft.sections : undefined,
    tags: draft.tags?.length ? draft.tags : undefined,
    relations: draft.relations?.length ? await resolveDraftRelations(draft.relations) : undefined,
  };

  const saved = await upsertGeneratedKnowledgeEntry({
    entry,
    sourceQuery: trimmed,
  });

  return {
    entry: saved,
    source: "deepseek" as const,
    created: true,
    model,
  };
}
