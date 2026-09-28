"use strict";
/* ================================================================
   settings.js — 设置抽屉（主题 / 动画 / 周起始 / 卡片显隐 / 预设时长）
   依赖：storage.js（S / save / LS_KEY）
          theme.js（applyTheme）
          clock.js（buildClock / renderClock）
          calendar.js（renderCal）
          timer.js（tRunning / tTotal / tLeft / renderTimer / renderPresets）
   全局导出：syncSettingsUI() / openDrawer() / closeDrawer()
   ================================================================ */
const drawer=document.getElementById("drawer"), mask=document.getElementById("mask");
function openDrawer(){ drawer.classList.add("on"); mask.classList.add("on"); syncSettingsUI(); }
function closeDrawer(){ drawer.classList.remove("on"); mask.classList.remove("on"); }
document.getElementById("btnSettings").onclick=openDrawer;
document.getElementById("drawerClose").onclick=closeDrawer;
mask.onclick=closeDrawer;
function syncSettingsUI(){
  document.querySelectorAll("#segTheme button").forEach(b=>b.classList.toggle("on",b.dataset.v===S.theme));
  document.querySelectorAll("#segAnim button").forEach(b=>b.classList.toggle("on",b.dataset.v===S.anim));
  document.querySelectorAll("#segWeek button").forEach(b=>b.classList.toggle("on",+b.dataset.v===S.weekStart));
  document.querySelectorAll(".chk input").forEach(c=>c.checked=!!S.cards[c.dataset.card]);
  document.querySelectorAll("[data-timer]").forEach(inp=>inp.value=S.timers[+inp.dataset.timer]);
}
function segBind(id,fn){
  document.querySelectorAll("#"+id+" button").forEach(b=>b.onclick=()=>{
    fn(b.dataset.v); save(); syncSettingsUI();   // 点击后立即刷新选中态
  });
}
segBind("segTheme",v=>{ S.theme=v; applyTheme(); });
segBind("segAnim",v=>{ S.anim=v; document.body.dataset.anim=v; buildClock(); renderClock(); });
segBind("segWeek",v=>{ S.weekStart=+v; renderCal(); });
document.querySelectorAll(".chk input").forEach(c=>c.onchange=()=>{
  S.cards[c.dataset.card]=c.checked; save();
  document.getElementById("card-"+c.dataset.card).classList.toggle("hidden",!c.checked);
});
document.querySelectorAll("[data-timer]").forEach(inp=>inp.onchange=()=>{
  const v=Math.max(1,Math.min(180,parseInt(inp.value)||5));
  inp.value=v; S.timers[+inp.dataset.timer]=v; save();
  if(!tRunning){ tTotal=S.timers[0]*60; tLeft=tTotal; renderTimer(); }
  renderPresets();
});
document.getElementById("btnReset").onclick=()=>{
  if(confirm("确定清除所有本地数据（设置、日历标记）？此操作不可撤销。")){
    localStorage.removeItem(LS_KEY); localStorage.removeItem("dash-marks"); location.reload();
  }
};
