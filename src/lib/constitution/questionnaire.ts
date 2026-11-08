/**
 * 体质问卷：题目定义 + 评分映射的唯一来源。
 * 界面（ConstitutionWorkbench）和评分引擎（screening-engine）都从这里读取，
 * 题目增删改只需要改这一个文件，不会再出现“界面和引擎题号对不上”的问题。
 */

export type QuestionKey =
  | "fatigue"
  | "short_breath"
  | "spontaneous_sweat"
  | "cold_limbs"
  | "prefer_warm"
  | "cold_abdomen"
  | "dry_mouth"
  | "poor_sleep"
  | "hot_palms"
  | "post_meal_bloat"
  | "sticky_stool"
  | "phlegm_heavy"
  | "acne_bitter_mouth"
  | "stress_chest"
  | "easy_bruise"
  | "dull_complexion"
  | "allergy"
  | "seasonal_sneeze";

export const QUESTION_SCALE = [
  { value: 1, label: "几乎没有" },
  { value: 2, label: "偶尔" },
  { value: 3, label: "有时" },
  { value: 4, label: "经常" },
  { value: 5, label: "总是" },
] as const;

export const SCALE_MIN = 1;
export const SCALE_MAX = 5;

export type QuestionDef = { key: QuestionKey; label: string; hint: string };

export type QuestionGroup = {
  title: string;
  description: string;
  /** 本组主要评估的体质，用于界面小标签 */
  tag: string;
  questions: QuestionDef[];
};

/** 6 组 × 3 题 = 18 题 */
export const QUESTION_GROUPS: QuestionGroup[] = [
  {
    title: "元气状态",
    description: "评估气虚、卫表不固等倾向。",
    tag: "气虚",
    questions: [
      { key: "fatigue", label: "最近是否容易疲乏、精神不足？", hint: "关注体力、精神和恢复速度。" },
      { key: "short_breath", label: "活动后是否容易气短、懒言？", hint: "如爬楼、快走后明显气短。" },
      { key: "spontaneous_sweat", label: "是否容易出汗，或稍动即汗？", hint: "非高温或运动场景下也明显出汗。" },
    ],
  },
  {
    title: "寒热耐受",
    description: "评估阳虚、寒湿或热象背景。",
    tag: "阳虚",
    questions: [
      { key: "cold_limbs", label: "是否比别人更怕冷，手脚偏凉？", hint: "同等环境下畏寒或四肢不温。" },
      { key: "prefer_warm", label: "是否偏爱热饮热食，不耐寒凉？", hint: "喝冷饮或吃生冷后不适更明显。" },
      { key: "cold_abdomen", label: "腰膝、腹部是否常有冷感或不适？", hint: "冷痛、隐痛或喜温喜按。" },
    ],
  },
  {
    title: "津液与睡眠",
    description: "评估阴虚、津亏和虚热倾向。",
    tag: "阴虚",
    questions: [
      { key: "dry_mouth", label: "是否容易口干、咽干或想喝水？", hint: "尤其夜间或午后更明显。" },
      { key: "poor_sleep", label: "是否容易心烦、睡眠浅、多梦？", hint: "入睡困难、易醒或梦多。" },
      { key: "hot_palms", label: "是否有手足心热、午后燥热感？", hint: "不一定伴随体温升高。" },
    ],
  },
  {
    title: "脾胃与湿浊",
    description: "评估痰湿与运化状态。",
    tag: "痰湿",
    questions: [
      { key: "post_meal_bloat", label: "是否容易腹胀、饭后困倦或消化慢？", hint: "进食后胀满、嗳气或犯困。" },
      { key: "sticky_stool", label: "是否大便黏滞不爽，或身体沉重？", hint: "排便不净、黏马桶、头身困重。" },
      { key: "phlegm_heavy", label: "是否痰多、口中黏腻、头身困重？", hint: "晨起或饭后黏腻感更明显。" },
    ],
  },
  {
    title: "情志与气血",
    description: "评估气郁与血瘀倾向。",
    tag: "气郁 · 血瘀",
    questions: [
      { key: "stress_chest", label: "情绪压力大时，是否胸闷、叹气、胁肋胀？", hint: "与压力、情绪波动相关。" },
      { key: "easy_bruise", label: "是否容易出现皮肤瘀斑，或身体某处有固定的刺痛？", hint: "轻微磕碰就青紫，或疼痛位置固定、夜间明显。" },
      { key: "dull_complexion", label: "是否面色偏暗、唇色偏暗或皮肤粗糙干涩？", hint: "关注长期的面色和唇色，不是熬夜后的暂时状态。" },
    ],
  },
  {
    title: "湿热与敏感",
    description: "评估湿热与特禀信号。",
    tag: "湿热 · 特禀",
    questions: [
      { key: "acne_bitter_mouth", label: "是否容易长痘、口苦、口气重？", hint: "偏向湿热、胃热等信号。" },
      { key: "allergy", label: "是否有皮肤敏感、鼻炎、荨麻疹或过敏倾向？", hint: "关注长期或反复发作情况。" },
      { key: "seasonal_sneeze", label: "换季、闻到特殊气味或接触花粉尘螨时，是否容易打喷嚏、鼻塞或皮肤发痒？", hint: "与季节、环境变化明显相关。" },
    ],
  },
];

export const ALL_QUESTIONS: QuestionDef[] = QUESTION_GROUPS.flatMap((g) => g.questions);
export const ALL_QUESTION_KEYS: QuestionKey[] = ALL_QUESTIONS.map((q) => q.key);

/** 8 个偏颇体质的评分映射；平和质由偏颇程度反推，不单独设题。 */
export type BiasedConstitutionCode =
  | "qixu"
  | "yangxu"
  | "yinxu"
  | "tanshi"
  | "shire"
  | "xueyu"
  | "qiyu"
  | "tebing";

export const CONSTITUTION_SCORING: {
  code: BiasedConstitutionCode;
  label: string;
  /** 题目 -> 权重。得分 = Σ权重×(答案-1) / Σ权重×4 × 100 */
  items: Partial<Record<QuestionKey, number>>;
}[] = [
  { code: "qixu", label: "气虚质", items: { fatigue: 1, short_breath: 1, spontaneous_sweat: 1 } },
  { code: "yangxu", label: "阳虚质", items: { cold_limbs: 1, prefer_warm: 1, cold_abdomen: 1 } },
  { code: "yinxu", label: "阴虚质", items: { dry_mouth: 1, poor_sleep: 0.7, hot_palms: 1 } },
  { code: "tanshi", label: "痰湿质", items: { post_meal_bloat: 0.7, sticky_stool: 0.6, phlegm_heavy: 1 } },
  { code: "shire", label: "湿热质", items: { acne_bitter_mouth: 1, sticky_stool: 0.8 } },
  { code: "xueyu", label: "血瘀质", items: { easy_bruise: 1, dull_complexion: 1 } },
  { code: "qiyu", label: "气郁质", items: { stress_chest: 1, poor_sleep: 0.5 } },
  { code: "tebing", label: "特禀质", items: { allergy: 1, seasonal_sneeze: 1 } },
];
