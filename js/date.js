"use strict";
/* ================================================================
   date.js — 日期卡片渲染
   依赖：lunar.js（solar2lunar / lunarFest / solarFest）
   全局导出：renderDate()
   ================================================================ */
const WEEK_CN=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
function renderDate(){
  const n=new Date(), L=solar2lunar(n);
  document.getElementById("dDay").textContent = n.getDate();
  document.getElementById("dMonth").textContent = (n.getMonth()+1)+"月";
  document.getElementById("dWeek").textContent = WEEK_CN[n.getDay()];
  document.getElementById("dCN").textContent = n.getFullYear()+"年"+(n.getMonth()+1)+"月"+n.getDate()+"日";
  const fest = lunarFest[L.month+"-"+L.day] || solarFest[(n.getMonth()+1)+"-"+n.getDate()];
  document.getElementById("dLunar").innerHTML =
    "农历 "+L.gzYear+"年（"+L.zodiac+"） "+L.monthCN+L.dayCN + (fest? " · <b>"+fest+"</b>":"");
}
