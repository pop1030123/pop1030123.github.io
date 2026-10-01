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
/* ============ 跨天自动刷新 ============
   日历的“今日”高亮、农历标签等都依赖渲染时刻的 new Date()；
   仅靠每秒的 renderDate/renderClock 不会重新绘制日历，因此加一个
   按分钟巡检：日期字符串变了就重渲染日历（用户当前查看的月份保持不变），
   并同步刷新日期卡片。  */
let _lastDayKey=new Date().toDateString();
function _checkDayRollover(){
  const k=new Date().toDateString();
  if(k!==_lastDayKey){
    _lastDayKey=k;
    renderDate();
    calFollowToday();    /* 未手动翻页则跳到新的当月（跨月边界时月/年标题、today 一并刷新） */
    renderCal();
  }
}
setInterval(_checkDayRollover, 60*1000);     // 每分钟检查一次
document.addEventListener("visibilitychange", ()=>{
  /* 切回标签时也立即检查一次，避免后台停留跨天后回来还显示旧日期 */
  if(!document.hidden) _checkDayRollover();
});
