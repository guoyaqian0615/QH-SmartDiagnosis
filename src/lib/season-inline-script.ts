/** 在首帧绘制前按本机月份挂上 `season-*`，与 `useSeasonTheme` 规则一致 */
export const SEASON_INLINE_INIT = `(function(){var m=new Date().getMonth()+1;var s=m>=3&&m<=5?"spring":m>=6&&m<=8?"summer":m>=9&&m<=11?"autumn":"winter";var r=document.documentElement;r.classList.remove("season-spring","season-summer","season-autumn","season-winter");r.classList.add("season-"+s);r.dataset.season=s;})();`;
