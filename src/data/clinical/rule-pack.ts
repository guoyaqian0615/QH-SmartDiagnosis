import type { PrescriptionLine } from "@/types/clinical-inference";

export type SymptomDefinition = {
  id: string;
  label: string;
  keywords: string[];
};

export type FactorDefinition = {
  id: string;
  label: string;
  keywords: string[];
  analysis: string;
  lifestyleSuggestions?: string[];
  dietSuggestions?: string[];
};

export type SyndromeRule = {
  id: string;
  label: string;
  principle: string;
  summary: string;
  formulaTitle: string;
  sealNumber: string;
  prescriptionLines: PrescriptionLine[];
  symptomWeights: Record<string, number>;
  factorBonuses?: Record<string, number>;
  defaultCauseAnalysis: string[];
  dietSuggestions: string[];
  lifestyleSuggestions: string[];
  followUpQuestions: string[];
  cautions?: string[];
};

export const CLINICAL_SYMPTOMS: SymptomDefinition[] = [
  { id: "fatigue", label: "疲倦乏力", keywords: ["乏力", "疲劳", "疲倦", "困乏", "没精神", "无力"] },
  { id: "short-breath", label: "气短懒言", keywords: ["气短", "懒言", "说话没力", "活动后气短"] },
  {
    id: "poor-appetite",
    label: "纳差食少",
    keywords: ["纳差", "食欲差", "胃口差", "不想吃饭", "饭量少", "食欲不振", "食欲下降", "胃口不好", "不思饮食", "吃不下"],
  },
  { id: "bloating", label: "脘腹胀满", keywords: ["腹胀", "胃胀", "脘胀", "胀满", "饭后胀", "腹部胀"] },
  { id: "loose-stool", label: "便溏不成形", keywords: ["便溏", "稀便", "大便不成形", "腹泻"] },
  { id: "phlegm-heaviness", label: "痰多困重", keywords: ["痰多", "痰黏", "身体沉重", "困重", "口黏", "胸闷"] },
  { id: "dizziness", label: "头晕头重", keywords: ["头晕", "眩晕", "头重", "昏沉"] },
  { id: "stress", label: "情志不舒", keywords: ["烦躁", "焦虑", "压力大", "抑郁", "易怒", "郁闷", "紧张"] },
  { id: "chest-flank", label: "胸胁不舒", keywords: ["胸闷", "胁胀", "胁痛", "叹气", "善太息"] },
  { id: "poor-sleep", label: "睡眠不稳", keywords: ["失眠", "多梦", "早醒", "睡眠差", "难入睡", "睡不好"] },
  { id: "dry-mouth", label: "口干咽燥", keywords: ["口干", "咽干", "口渴", "咽燥", "想喝水"] },
  { id: "fever", label: "发热", keywords: ["发热", "发烧", "身热", "低热", "高热", "体温高", "热感"] },
  { id: "urine-yellow", label: "小便黄", keywords: ["尿黄", "小便黄", "尿赤", "小便短黄"] },
  { id: "bitter-mouth", label: "口苦口臭", keywords: ["口苦", "口臭", "长痘", "痤疮"] },
  { id: "heat-sign", label: "内热偏盛", keywords: ["手足心热", "潮热", "怕热", "心烦发热", "烦热"] },
  { id: "exterior-symptom", label: "外感表证", keywords: ["感冒", "外感", "恶寒", "怕风", "咽痛", "喉咙痛", "头痛", "鼻塞", "流涕", "流鼻涕", "咳嗽", "身痛"] },
  { id: "cold-sign", label: "畏寒肢冷", keywords: ["怕冷", "畏寒", "手脚凉", "四肢发冷", "喜热饮", "腹部发冷"] },
  { id: "pain-fixed", label: "疼痛固定", keywords: ["刺痛", "固定痛", "痛有定处", "久痛", "面色晦暗"] },
  { id: "constipation", label: "大便偏结", keywords: ["便秘", "大便干结", "排便困难", "大便干", "便干", "便结"] },
  { id: "edema", label: "浮肿水湿", keywords: ["浮肿", "水肿", "按之凹陷"] },
];

export const CLINICAL_FACTORS: FactorDefinition[] = [
  {
    id: "emotion",
    label: "情志压力负荷偏高",
    keywords: ["压力", "焦虑", "烦躁", "生气", "情绪", "紧张", "郁闷", "易怒"],
    analysis: "主诉中出现明显的情绪紧绷或压力线索，提示气机升降失调可能参与症状形成。",
    lifestyleSuggestions: ["连续高压阶段尽量留出固定缓冲时段，避免边工作边进食。"] ,
  },
  {
    id: "diet",
    label: "饮食失节或偏嗜肥甘辛辣",
    keywords: ["油腻", "辛辣", "夜宵", "饮酒", "奶茶", "冷饮", "暴饮暴食", "饮食不规律"],
    analysis: "饮食不节或过食肥甘厚味，会持续加重脾胃运化负担并放大湿浊表现。",
    dietSuggestions: ["先把夜宵、甜饮和高油重口味频次降下来，再看症状变化。"] ,
  },
  {
    id: "sleep",
    label: "睡眠恢复不足",
    keywords: ["熬夜", "晚睡", "失眠", "睡眠差", "睡不着", "早醒", "多梦"],
    analysis: "睡眠不足会放大口干、烦躁、疲乏和恢复慢等问题，是当前需要优先校正的背景因素。",
    lifestyleSuggestions: ["至少连续 1 周把入睡时间前移，观察疲乏与口干是否缓解。"] ,
  },
  {
    id: "cold-damp",
    label: "受凉受湿线索较多",
    keywords: ["受凉", "着凉", "吹空调", "潮湿", "淋雨", "阴冷"],
    analysis: "环境寒湿刺激与症状同时出现时，往往会加重畏寒、便溏、困重或肢体沉滞。",
    lifestyleSuggestions: ["腹背部与足踝注意保暖，减少久处潮湿阴冷环境。"] ,
  },
  {
    id: "summerheat",
    label: "暑热或高温暴晒线索",
    keywords: ["中暑", "暴晒", "高温", "闷热", "天气热", "太阳晒", "热天", "暑热", "晒后"],
    analysis: "症状起于高温、暴晒或闷热环境后，且伴发热、纳差、口渴或小便黄时，往往提示暑热或暑湿参与。",
    lifestyleSuggestions: ["近期避免继续暴晒和闷热环境，先补水、休息，再观察体温和胃口变化。"],
    dietSuggestions: ["短期饮食宜清淡补水，少油腻辛辣与酒精，避免继续助热。"],
  },
  {
    id: "sedentary",
    label: "久坐少动",
    keywords: ["久坐", "运动少", "缺乏运动", "坐得久"],
    analysis: "久坐少动会让气机运行更慢，也容易加重困重、腹胀和恢复迟缓。",
    lifestyleSuggestions: ["久坐每 60 分钟起身 3 到 5 分钟，饭后以轻步行替代久坐。"] ,
  },
  {
    id: "overwork",
    label: "劳倦过度",
    keywords: ["加班", "过劳", "劳累", "工作强度大", "用脑多", "连轴转"],
    analysis: "长期劳倦或恢复不足，会让脾胃和气血的代偿能力下降，疲乏与纳差更容易反复。",
    lifestyleSuggestions: ["先把高耗竭时段分段处理，避免空腹透支和连续硬扛。"] ,
  },
];

export const CLINICAL_SYNDROMES: SyndromeRule[] = [
  {
    id: "liver-spleen",
    label: "肝郁脾虚",
    principle: "疏肝健脾，理气和中",
    summary: "更偏向情志不舒与脾胃运化受阻并见的状态。",
    formulaTitle: "方意示意 · 逍遥散加减",
    sealNumber: "和",
    prescriptionLines: [
      { herb: "柴胡" },
      { herb: "白芍" },
      { herb: "白术" },
      { herb: "茯苓" },
      { herb: "陈皮" },
      { herb: "甘草" },
    ],
    symptomWeights: {
      stress: 2.4,
      "chest-flank": 2.1,
      bloating: 1.8,
      "poor-appetite": 1.5,
      "loose-stool": 1.2,
      "poor-sleep": 1.0,
      fatigue: 0.9,
    },
    factorBonuses: { emotion: 1.2, diet: 0.6, sleep: 0.3 },
    defaultCauseAnalysis: [
      "情志波动与进食节律被打乱后，肝气疏泄与脾胃运化容易同时受影响。",
      "若饭后腹胀、纳差和压力相关胸闷并见，通常提示这一路径更值得优先排查。",
    ],
    dietSuggestions: [
      "主食以小米、山药、南瓜等平和易消化食材为主，避免空腹辛辣与过量冷饮。",
      "两餐之间可少量用陈皮、佛手类芳香食材入膳，帮助理气和胃。",
      "先把进食时间固定下来，较少量多餐比忽饥忽饱更稳妥。",
    ],
    lifestyleSuggestions: [
      "尽量固定三餐节律，情绪波动明显时不要一边工作一边进食。",
      "餐后轻步行 10 到 15 分钟，避免立即久坐压迫脾胃运化。",
      "把胸闷、叹气、腹胀与压力事件做简单对照记录，方便复评。",
    ],
    followUpQuestions: [
      "胸闷、叹气或胁肋不舒是否在情绪波动时更明显？",
      "饭后是否更容易腹胀、困倦或嗳气？",
      "大便是否偏溏，或排后仍觉得不爽？",
    ],
  },
  {
    id: "spleen-qi",
    label: "脾胃气虚",
    principle: "健脾益气，和胃助运",
    summary: "更偏向久倦、纳差与运化偏弱的状态。",
    formulaTitle: "方意示意 · 四君子汤加味",
    sealNumber: "益",
    prescriptionLines: [
      { herb: "党参" },
      { herb: "白术" },
      { herb: "茯苓" },
      { herb: "山药" },
      { herb: "陈皮" },
      { herb: "炙甘草" },
    ],
    symptomWeights: {
      fatigue: 2.2,
      "short-breath": 1.8,
      "poor-appetite": 2.0,
      bloating: 1.4,
      "loose-stool": 1.6,
    },
    factorBonuses: { overwork: 1.0, diet: 0.8, sleep: 0.5 },
    defaultCauseAnalysis: [
      "劳倦、饮食不定或病后恢复不足时，脾胃气弱常会先表现为纳差、腹胀和恢复慢。",
      "如果稍活动就累、说话懒得多、便溏反复，这一方向通常更符合当前线索。",
    ],
    dietSuggestions: [
      "饮食以温软、易消化为先，可优先选择山药、莲子、小米、扁豆等食材。",
      "先减少生冷、冰品和空腹咖啡，把脾胃负担降下来。",
      "饭量不宜忽大忽小，先追求稳定摄入再谈进补。",
    ],
    lifestyleSuggestions: [
      "连续疲劳阶段先把作息拉回规律，少熬夜比额外进补更重要。",
      "运动以低到中等强度为主，避免一次性高消耗后更乏力。",
      "观察食欲、排便和体力恢复速度，作为后续复评的核心指标。",
    ],
    followUpQuestions: [
      "是否稍微活动后就更容易气短、疲倦？",
      "是否饭量下降、饭后困倦或腹胀明显？",
      "大便是否长期偏软，且恢复速度较慢？",
    ],
  },
  {
    id: "phlegm-damp",
    label: "痰湿内阻",
    principle: "燥湿化痰，理气和中",
    summary: "更偏向湿浊停滞、困重不爽的状态。",
    formulaTitle: "方意示意 · 二陈汤加减",
    sealNumber: "化",
    prescriptionLines: [
      { herb: "半夏" },
      { herb: "陈皮" },
      { herb: "茯苓" },
      { herb: "苍术" },
      { herb: "厚朴" },
      { herb: "甘草" },
    ],
    symptomWeights: {
      "phlegm-heaviness": 2.4,
      dizziness: 1.8,
      bloating: 1.5,
      "poor-appetite": 1.2,
      fatigue: 1.0,
      "loose-stool": 0.9,
    },
    factorBonuses: { diet: 1.1, sedentary: 0.7, "cold-damp": 0.5 },
    defaultCauseAnalysis: [
      "长期饮食偏甜腻、运动少或湿重环境，会让脾胃运化更差，湿浊聚而成痰。",
      "如果头重困倦、痰多口黏和胸闷腹胀并见，这一方向通常较值得优先考虑。",
    ],
    dietSuggestions: [
      "减少甜饮、奶茶、油炸和宵夜，先把最容易生湿的入口降下来。",
      "可用薏米、赤小豆、茯苓、冬瓜等偏轻清的食材做日常搭配。",
      "进食以七八分饱为宜，避免晚间重口味加重晨起困重。",
    ],
    lifestyleSuggestions: [
      "每天安排规律轻运动，把出汗量维持在微微汗出即可。",
      "避免久坐不动与白天长时间昏沉卧床，帮助气机与水湿流转。",
      "晨起口黏、头重和餐后困倦可作为后续观察指标。",
    ],
    followUpQuestions: [
      "是否经常觉得身体沉重、头重如裹，晨起尤其明显？",
      "是否痰多、口中黏腻或胸口发闷？",
      "平时是否偏爱甜饮、奶制品或夜宵？",
    ],
  },
  {
    id: "summerheat-damp",
    label: "暑湿夹热",
    principle: "清暑解表，化湿和中",
    summary: "更偏向高温、外感或暑湿夹热导致的短期发热与脾胃不和。",
    formulaTitle: "方意示意 · 新加香薷饮意",
    sealNumber: "解",
    prescriptionLines: [
      { herb: "香薷" },
      { herb: "厚朴" },
      { herb: "扁豆花" },
      { herb: "藿香" },
      { herb: "佩兰" },
      { herb: "连翘" },
    ],
    symptomWeights: {
      fever: 2.4,
      "exterior-symptom": 1.8,
      "poor-appetite": 1.8,
      "dry-mouth": 1.3,
      "urine-yellow": 1.8,
      constipation: 1.1,
    },
    factorBonuses: { summerheat: 1.5, diet: 0.4 },
    defaultCauseAnalysis: [
      "如果症状出现在天气闷热、暴晒后或外感初起阶段，且同时伴发热、食欲下降和便尿偏热，往往提示暑热或暑湿夹热参与。",
      "这类情况多见于短期急性不适，核心是热象与脾胃受困并见，而不是单纯长期体虚。",
    ],
    dietSuggestions: [
      "短期先以清淡补水为主，可选择米汤、粥羹、冬瓜、丝瓜等较轻的饮食形式。",
      "先暂停辛辣烧烤、酒精和高油夜宵，避免热与湿继续叠加。",
      "若胃口差，不必强行进补，少量多次进食通常比大餐更稳妥。",
    ],
    lifestyleSuggestions: [
      "优先休息、避暑和补水，减少继续暴晒或在闷热环境中久留。",
      "若仍有发热感，先记录体温变化与伴随症状，再决定是否需要进一步线下评估。",
      "观察食欲、小便颜色与大便性状，作为近期复评重点。",
    ],
    followUpQuestions: [
      "发热是在受凉感冒后出现，还是在暴晒、闷热环境后更明显？",
      "是否伴有头痛、咽痛、鼻塞、恶寒或明显口渴？",
      "小便黄和大便干是暂时加重，还是近期一直存在？",
    ],
    cautions: ["若持续高热、明显乏力、反复呕吐或出现意识不清，应及时线下就医。"],
  },
  {
    id: "damp-heat",
    label: "湿热蕴结",
    principle: "清利湿热，和中醒脾",
    summary: "更偏向湿与热并见、郁而不清的状态。",
    formulaTitle: "方意示意 · 甘露消毒丹意",
    sealNumber: "清",
    prescriptionLines: [
      { herb: "藿香" },
      { herb: "佩兰" },
      { herb: "茵陈" },
      { herb: "滑石" },
      { herb: "黄芩" },
      { herb: "通草" },
    ],
    symptomWeights: {
      "bitter-mouth": 2.4,
      "urine-yellow": 1.6,
      fever: 0.8,
      "heat-sign": 1.5,
      "phlegm-heaviness": 1.5,
      "poor-appetite": 0.8,
      constipation: 1.2,
      bloating: 1.0,
      "dry-mouth": 1.0,
      "poor-sleep": 0.8,
    },
    factorBonuses: { diet: 1.2, sleep: 0.6 },
    defaultCauseAnalysis: [
      "肥甘辛辣、夜宵饮酒或熬夜后，湿与热常会同时偏盛，表现出黏滞和烦热并见。",
      "如果口苦口臭、尿黄、长痘与腹胀困重共存，这一方向更值得重点核对。",
    ],
    dietSuggestions: [
      "近期饮食宜清淡，少酒少辣少烧烤，避免再推高湿热负担。",
      "可选择冬瓜、丝瓜、芹菜、薏米、绿叶菜等偏清利食材。",
      "先把重口味夜宵停下来，通常比叠加大量所谓清热产品更有效。",
    ],
    lifestyleSuggestions: [
      "保持排便通畅与饮水节律，避免昼夜颠倒进一步助热生湿。",
      "运动以中等强度微汗为宜，别在闷热时段硬顶高强度。",
      "把口苦、痤疮、尿色和睡眠质量作为近期复评重点。",
    ],
    followUpQuestions: [
      "是否伴有口苦、口臭、尿黄或面部易起痘？",
      "是否重口味、夜宵、饮酒后症状更明显？",
      "大便是否偏黏滞或不爽，排后仍觉不净？",
    ],
    cautions: ["若出现持续发热、腹痛加重或明显呕吐腹泻，应及时线下就医。"],
  },
  {
    id: "yin-deficiency",
    label: "阴虚内热",
    principle: "养阴清热，宁心润燥",
    summary: "更偏向津液不足、虚热内扰的状态。",
    formulaTitle: "方意示意 · 知柏地黄丸意",
    sealNumber: "润",
    prescriptionLines: [
      { herb: "熟地黄" },
      { herb: "山茱萸" },
      { herb: "山药" },
      { herb: "知母" },
      { herb: "黄柏" },
      { herb: "丹皮" },
    ],
    symptomWeights: {
      "dry-mouth": 2.1,
      "poor-sleep": 1.6,
      "heat-sign": 2.0,
      constipation: 1.0,
      fatigue: 0.8,
    },
    factorBonuses: { sleep: 1.0, overwork: 0.8 },
    defaultCauseAnalysis: [
      "长期熬夜、耗神过度或恢复不足时，津液与阴分容易被持续消耗。",
      "若口干、心烦、睡浅、多梦或午后烘热并见，这一路径往往更符合当前表现。",
    ],
    dietSuggestions: [
      "饮食以清润平和为主，可用百合、银耳、莲子、山药等做日常搭配。",
      "减少辛辣燥热与酒精刺激，避免边熬夜边用重口味加重内热。",
      "不急于大量温补，先把睡眠和补水节律稳定下来。",
    ],
    lifestyleSuggestions: [
      "优先修复睡眠窗口，至少连续一周观察入睡时间前移后的变化。",
      "高脑力时段之间穿插短休息，减少持续耗神。",
      "记录口干、夜间醒来次数与午后烦热，方便后续复评。",
    ],
    followUpQuestions: [
      "是否夜间口干更明显，或经常需要喝水？",
      "是否伴有心烦、睡眠浅、多梦或午后发热感？",
      "大便是否偏干，近期是否长期熬夜？",
    ],
  },
  {
    id: "yang-deficiency",
    label: "阳虚寒湿",
    principle: "温阳健脾，散寒化湿",
    summary: "更偏向阳气不足、寒湿偏盛的状态。",
    formulaTitle: "方意示意 · 理中汤合真武汤意",
    sealNumber: "温",
    prescriptionLines: [
      { herb: "干姜" },
      { herb: "白术" },
      { herb: "茯苓" },
      { herb: "附子" },
      { herb: "白芍" },
      { herb: "生姜" },
    ],
    symptomWeights: {
      "cold-sign": 2.4,
      "loose-stool": 1.6,
      fatigue: 1.4,
      bloating: 1.0,
      edema: 1.4,
    },
    factorBonuses: { "cold-damp": 1.2, sedentary: 0.3, overwork: 0.4 },
    defaultCauseAnalysis: [
      "受凉受湿、久病体虚或长期恢复不足，会让温煦推动能力进一步下降。",
      "如果怕冷、便溏、乏力与肢体沉重或浮肿并见，这一方向较值得优先核对。",
    ],
    dietSuggestions: [
      "饮食以温软熟食为主，减少生冷瓜果、冰饮和空腹冷食。",
      "可用生姜、山药、胡萝卜、羊肉类温和食材在耐受范围内少量搭配。",
      "先把受凉后腹泻、晨起怕冷这些触发因素记录下来，便于后续调整。",
    ],
    lifestyleSuggestions: [
      "腹背、腰骶和下肢注意保暖，空调环境不要久坐不动。",
      "运动以轻缓拉伸和步行为主，帮助阳气推动而不过度消耗。",
      "观察晨起怕冷、手足温度与大便性状是否随作息改善而变化。",
    ],
    followUpQuestions: [
      "是否晨起怕冷、手足偏凉，遇冷后更不舒服？",
      "是否腹部喜温喜按，或稍吃生冷就腹泻？",
      "是否伴有下肢浮肿、腰膝酸软或精神不振？",
    ],
    cautions: ["若畏寒明显且伴持续乏力、水肿或心悸气促，建议尽快线下评估。"],
  },
  {
    id: "qi-stagnation-blood-stasis",
    label: "气滞血瘀",
    principle: "理气活血，通络止痛",
    summary: "更偏向气机郁滞日久、血行不畅的状态。",
    formulaTitle: "方意示意 · 血府逐瘀汤意",
    sealNumber: "通",
    prescriptionLines: [
      { herb: "柴胡" },
      { herb: "当归" },
      { herb: "川芎" },
      { herb: "赤芍" },
      { herb: "桃仁" },
      { herb: "红花" },
    ],
    symptomWeights: {
      "pain-fixed": 2.5,
      "chest-flank": 1.4,
      stress: 1.0,
      "poor-sleep": 0.6,
    },
    factorBonuses: { emotion: 0.8, sedentary: 0.6 },
    defaultCauseAnalysis: [
      "气机不畅持续时间较长时，容易进一步影响局部血行，表现为固定性不适或久痛。",
      "若症状位置较固定、反复时间长，且情绪紧张后加重，这一方向更值得结合病程复核。",
    ],
    dietSuggestions: [
      "饮食保持清淡均衡，避免长期重口味与饮酒加重瘀滞。",
      "可在耐受范围内搭配山楂、玫瑰花、木耳等偏和缓的日常食材。",
      "不要把食疗当作急性疼痛处理手段，先观察诱因与病程特点。",
    ],
    lifestyleSuggestions: [
      "久坐后固定部位不适往往更明显，建议定时起身活动和轻度拉伸。",
      "把疼痛发生时间、部位和诱发因素记录下来，便于后续判断趋势。",
      "情绪紧张时先降低应激水平，再观察症状是否随之缓解。",
    ],
    followUpQuestions: [
      "不适是否有固定部位，且反复时间较长？",
      "情绪紧张或久坐后，症状是否更容易加重？",
      "是否伴有夜间加重、刺痛或按压不适明显？",
    ],
    cautions: ["如果疼痛进行性加重、影响活动或伴胸痛胸闷明显，应及时线下就医。"],
  },
];

export const GENERAL_CLINICAL_CAUTION =
  "本结果仅用于健康管理与信息整理，不构成医疗诊断或处方；若症状持续、加重或伴明显不适，请及时线下就医。";
