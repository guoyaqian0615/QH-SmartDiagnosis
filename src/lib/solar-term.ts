/** 公历近似节气表（民俗常用日，非天文精密值），用于时令展示 */

type Md = { m: number; d: number; name: string };

/** 自「小寒」起按公历先后排序的一轮 */
const TERMS_IN_ORDER: Md[] = [
  { m: 1, d: 6, name: "小寒" },
  { m: 1, d: 20, name: "大寒" },
  { m: 2, d: 4, name: "立春" },
  { m: 2, d: 19, name: "雨水" },
  { m: 3, d: 6, name: "惊蛰" },
  { m: 3, d: 21, name: "春分" },
  { m: 4, d: 5, name: "清明" },
  { m: 4, d: 20, name: "谷雨" },
  { m: 5, d: 6, name: "立夏" },
  { m: 5, d: 21, name: "小满" },
  { m: 6, d: 6, name: "芒种" },
  { m: 6, d: 21, name: "夏至" },
  { m: 7, d: 7, name: "小暑" },
  { m: 7, d: 23, name: "大暑" },
  { m: 8, d: 8, name: "立秋" },
  { m: 8, d: 23, name: "处暑" },
  { m: 9, d: 8, name: "白露" },
  { m: 9, d: 23, name: "秋分" },
  { m: 10, d: 8, name: "寒露" },
  { m: 10, d: 23, name: "霜降" },
  { m: 11, d: 7, name: "立冬" },
  { m: 11, d: 22, name: "小雪" },
  { m: 12, d: 7, name: "大雪" },
  { m: 12, d: 22, name: "冬至" },
];

function cmpMd(date: Date, m: number, d: number): number {
  const dm = date.getMonth() + 1;
  const dd = date.getDate();
  if (dm !== m) return dm - m;
  return dd - d;
}

/**
 * 当前所处节气（公历近似）。元旦至小寒前归为「冬至」气内。
 */
export function getSolarTermName(date: Date): string {
  let last: Md = { m: 12, d: 22, name: "冬至" };
  for (const t of TERMS_IN_ORDER) {
    if (cmpMd(date, t.m, t.d) >= 0) last = t;
    else break;
  }
  return last.name;
}
