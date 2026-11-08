import type { Season } from "@/hooks/useSeasonTheme";

export const SEASONAL_GUIDE: Record<
  Season,
  { title: string; body: string; tag: string }
> = {
  spring: {
    tag: "生发之气",
    title: "春应肝木，疏泄条达",
    body:
      "夜卧早起，广步于庭。饮食宜少酸多甘，以养脾气；情志宜舒展，忌郁怒。令阳气渐升，与天地俱生，万物以荣。",
  },
  summer: {
    tag: "蕃秀之令",
    title: "夏应心火，清和为要",
    body:
      "使志无怒，使华英成秀。午后小憩以养心阴，汗出当风则宜慎。味苦清心、味酸收津，忌过食冰饮以伤脾阳。",
  },
  autumn: {
    tag: "容平之节",
    title: "秋应肺金，收敛神气",
    body:
      "早卧早起，与鸡俱兴。润燥为先，少辛增酸以养肝气；呼吸宜深长，以应秋之清肃，使肺气清宁。",
  },
  winter: {
    tag: "闭藏之道",
    title: "冬应肾水，伏藏为本",
    body:
      "早卧晚起，必待日光。去寒就温，无泄皮肤。宜温补填精，忌大汗大泄，使阳气潜藏，以待春生。",
  },
};
