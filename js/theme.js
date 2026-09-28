"use strict";
/* ================================================================
   theme.js — 深浅色主题（跟随系统 / 手动切换）
   依赖：storage.js（S / save）
   全局导出：applyTheme()
   ================================================================ */
const mq = matchMedia("(prefers-color-scheme: dark)");
function applyTheme(){
  const dark = S.theme==="dark" || (S.theme==="auto" && mq.matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}
try{ mq.addEventListener("change", ()=>{ if(S.theme==="auto") applyTheme(); }); }
catch(e){ mq.addListener(()=>{ if(S.theme==="auto") applyTheme(); }); }   /* Safari<14 兼容 */
document.getElementById("btnTheme").onclick = ()=>{
  const nowDark = document.documentElement.dataset.theme==="dark";
  S.theme = nowDark ? "light" : "dark"; save(); applyTheme(); syncSettingsUI();
};
