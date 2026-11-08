/** 朋友圈风 · 膳食卡片示意（图源 Unsplash，仅作 UI 演示） */

export type DietMomentCard = {
  id: string;
  title: string;
  /** Unsplash 直链 */
  imageSrc: string;
  imageAlt: string;
  tags: string[];
  blurb: string;
  author: string;
  /** 展示用「互动」数字 */
  likes: number;
};

export const DIET_MOMENTS: DietMomentCard[] = [
  {
    id: "m1",
    title: "山药薏米芡实粥 · 晨间一碗",
    imageSrc:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900&q=80&auto=format&fit=crop&ixlib=rb-4.0.3",
    imageAlt: "一碗温热的谷物粥",
    tags: ["#补气", "#祛湿", "#健脾"],
    blurb: "山药补脾益肺，薏米淡渗利湿，芡实固肾涩精；三味同煮，口感绵润，适合湿重兼乏力者作早餐示意。",
    author: "岐黄小膳",
    likes: 1284,
  },
  {
    id: "m2",
    title: "百合莲子银耳羹",
    imageSrc:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=900&q=80&auto=format&fit=crop&ixlib=rb-4.0.3",
    imageAlt: "清润甜品羹汤",
    tags: ["#养阴", "#润燥", "#安神"],
    blurb: "百合清心安神，莲子健脾养心，银耳滋阴润肺；少糖清炖，宜秋季或熬夜后口干咽燥的调养示意。",
    author: "时令食单",
    likes: 956,
  },
  {
    id: "m3",
    title: "姜枣茶 · 午后暖胃",
    imageSrc:
      "https://images.unsplash.com/photo-1682530016903-c84a4a7dbd61?w=900&q=80&auto=format&fit=crop&ixlib=rb-4.0.3",
    imageAlt: "一杯温茶",
    tags: ["#温中", "#散寒", "#调和营卫"],
    blurb: "生姜温中散寒，大枣补中益气；体寒畏冷、手足不温者可作日常茶饮示意（实热者慎用）。",
    author: "暖身笔记",
    likes: 2103,
  },
];
