"use strict";
/* ================================================================
   storage.js — 设置与日历标记的持久化（localStorage）
   全局导出：LS_KEY / S / save() / marks / saveMarks() / escHtml()
   ================================================================ */
const LS_KEY = "dash-settings-v1";
const DEFAULTS = {
  theme:"auto", anim:"flip", weekStart:0,
  cards:{date:true,time:true,calendar:true,timer:true,weather:true},
  timers:[5,10,20,30]
};
let S = loadSettings();
function loadSettings(){
  try{
    const raw = JSON.parse(localStorage.getItem(LS_KEY));
    if(raw) return Object.assign({}, DEFAULTS, raw, {cards:Object.assign({},DEFAULTS.cards,raw.cards||{}), timers:(raw.timers&&raw.timers.length===4)?raw.timers:DEFAULTS.timers.slice()});
  }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULTS));
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(S)); }

let marks = {};
try{
  const raw = JSON.parse(localStorage.getItem("dash-marks")||"{}");
  marks={};
  for(const k in raw){                 // 兼容旧版单标签格式，自动迁移为数组
    const v=raw[k];
    if(Array.isArray(v)) marks[k]=v;
    else if(v&&(v.color||v.label)) marks[k]=[v];
  }
}catch(e){ marks={}; }
function saveMarks(){ localStorage.setItem("dash-marks", JSON.stringify(marks)); }
function escHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
