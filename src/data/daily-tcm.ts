/** 每日一词 / 小知识池：按日期稳定轮换 */

export type DailyTcmEntry = {
  term: string;
  /** 汉语拼音，可选 */
  reading?: string;
  /** 一句小知识 */
  gloss: string;
};

export const DAILY_TCM_POOL: DailyTcmEntry[] = [
  { term: "阴阳", reading: "yīn yáng", gloss: "对立统一、互根互用，是辨证的总纲。" },
  { term: "藏象", reading: "zàng xiàng", gloss: "内脏功能与体表征象相应，外可揣内。" },
  { term: "经络", gloss: "气血运行通道，针灸推拿多依经取穴。" },
  { term: "气血津液", gloss: "人体基本物质；气为帅，血为母，津液化生有源。" },
  { term: "辨证论治", gloss: "因人、因时、因地而异，方随证转。" },
  { term: "四诊", gloss: "望闻问切合参，信息越全，辨证越稳。" },
  { term: "八纲", gloss: "阴阳表里寒热虚实，提纲挈领辨大方向。" },
  { term: "六淫", gloss: "风寒暑湿燥火太过或不及，皆可成为外感病因。" },
  { term: "七情", gloss: "喜怒忧思悲恐惊过激，易内伤脏腑气机。" },
  { term: "标本", gloss: "急则治标，缓则治本；有时标本兼顾。" },
  { term: "虚实", gloss: "正气不足为虚，邪气亢盛为实，补泻有别。" },
  { term: "表里", gloss: "病位浅深与传变趋势，决定汗吐下和等法。" },
  { term: "寒热", gloss: "阳盛多热，阴盛多寒；寒热错杂需细辨。" },
  { term: "君臣佐使", gloss: "组方配伍结构，主药辅药各司其职。" },
  { term: "性味归经", gloss: "四气五味与脏腑经络趋向，指导用药食。" },
  { term: "升降浮沉", gloss: "药势有向，顺病位病势更易取效。" },
  { term: "炮制", gloss: "减毒增效、改变归经，同一药源功用可异。" },
  { term: "配伍禁忌", gloss: "十八反十九畏等，临床与药膳均需留意。" },
  { term: "子午流注", gloss: "气血盛衰随十二时辰起伏，可参作息针灸。" },
  { term: "体质", gloss: "个体相对稳定的身心特征，调养需因质制宜。" },
  { term: "治未病", gloss: "未病先防、既病防变、瘥后防复。" },
  { term: "整体观念", gloss: "人自身、人与自然、人与社会相统一。" },
  { term: "同病异治", gloss: "同一病名，证候不同则治法方药不同。" },
  { term: "异病同治", gloss: "不同疾病，病机相同可用同一治法。" },
  { term: "汗法", gloss: "开泄腠理、调和营卫，多用于表证。" },
  { term: "和法", gloss: "和解少阳、调和肝脾等，以平为期。" },
  { term: "温法", gloss: "回阳救逆、温中散寒，用于里寒证。" },
  { term: "清法", gloss: "清热泻火、解毒凉血，用于里热炽盛。" },
  { term: "补法", gloss: "益气养血滋阴温阳，虚则补之。" },
  { term: "消法", gloss: "消食导滞、软坚散结，用于有形实邪。" },
  { term: "下法", gloss: "攻逐里实，中病即止，防伤正气。" },
  { term: "因时制宜", gloss: "春夏养阳、秋冬养阴，起居膳食随节气微调。" },
  { term: "因地制宜", gloss: "东南多湿热、西北多燥寒，方宜随水土。" },
  { term: "因人制宜", gloss: "老幼妇孺、劳逸形志不同，剂量治法须别。" },
  { term: "脉象", gloss: "浮沉迟数有力无力等，反映气血阴阳状态。" },
  { term: "舌诊", gloss: "舌质舌苔与润燥，为望诊重要窗口。" },
  { term: "证候", gloss: "疾病某一阶段病因病位病性的概括，是论治依据。" },
  { term: "方剂", gloss: "多药配伍、剂型与煎服法，皆影响疗效。" },
  { term: "针灸", gloss: "通过经络腧穴调节气血，手法与得气很重要。" },
  { term: "推拿", gloss: "理筋通络、调整关节，常用于筋骨与小儿。" },
  { term: "药膳", gloss: "药食同源，性味平和者可作日常调养。" },
];

export function getDailyTcmIndex(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor(
    (date.getTime() - start.getTime()) / 86_400_000,
  );
  return dayOfYear % DAILY_TCM_POOL.length;
}

export function getDailyTcmForDate(date: Date): DailyTcmEntry {
  return DAILY_TCM_POOL[getDailyTcmIndex(date)]!;
}
