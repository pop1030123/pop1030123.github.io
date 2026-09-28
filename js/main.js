"use strict";
/* ================================================================
   main.js — 初始化入口（必须最后加载）
   依赖：以上全部模块
   ================================================================ */
applyTheme();
document.body.dataset.anim=S.anim;
buildClock();
for(const k in S.cards){ document.getElementById("card-"+k).classList.toggle("hidden",!S.cards[k]); }
renderDate(); renderClock(); renderCal(); fetchWeather();
setInterval(()=>{ renderClock(); renderDate(); },1000);
