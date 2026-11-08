import type { Season } from "@/types/season";

/** 时令养生：随四季界面主题的简要建议（示意文案） */

export type SeasonalWellness = {
  title: string;
  advice: string;
  diet: string;
  routine: string;
};

export const SEASONAL_WELLNESS: Record<Season, SeasonalWellness> = {
  spring: {
    title: "春令 · 生发条达",
    advice: "夜卧早起，广步于庭；情志宜舒展，忌抑郁以应春气。",
    diet: "少酸增甘以养脾，荠菜、菠菜、芽菜等清升之品为宜。",
    routine: "晨起梳头沐阳，午后防风护颈；运动以和缓有氧为佳。",
  },
  summer: {
    title: "夏令 · 蕃秀养心",
    advice: "使志无怒，使华英成秀；暑热伤心阳，宜静养与适度汗出。",
    diet: "清淡少油腻，绿豆、冬瓜、莲子心示意清暑；忌过冰伤阳。",
    routine: "午间小憩养心；避开烈日暴晒，补水宜少量频饮。",
  },
  autumn: {
    title: "秋令 · 容平润燥",
    advice: "早卧早起，与鸡俱兴；收敛神气，使秋气平，防悲忧伤肺。",
    diet: "少辛增酸，梨、银耳、芝麻示意润肺防燥。",
    routine: "晨练注意保暖；皮肤口唇干燥时可适度加湿与润护。",
  },
  winter: {
    title: "冬令 · 闭藏养肾",
    advice: "早卧晚起，必待日光；去寒就温，无泄皮肤，使气亟夺。",
    diet: "温补有度，黑豆、核桃、羊肉类示意（体质湿热者慎用）。",
    routine: "忌大汗出表；日光充足时适度户外活动，护足踝与腰。",
  },
};
