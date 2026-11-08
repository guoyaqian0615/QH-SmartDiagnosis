/**
 * 首屏绘制前恢复禅意光效，避免与 JS 主包闪断；与 `useUIStore.setZenMode` 约定一致
 */
export const ZEN_INLINE_INIT = `(function(){
  try {
    var z=localStorage.getItem("dbcnet-zen");
    if (z!=="ink" && z!=="xuan") z="xuan";
    var h=document.documentElement;
    h.setAttribute("data-zen",z);
    if (z==="ink"){ h.classList.add("dark"); } else { h.classList.remove("dark"); }
  } catch (e) {}
})();`;
