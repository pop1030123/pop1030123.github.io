"use strict";
/* ================================================================
   timer.js — 倒计时卡片（番茄钟 / SVG 环形进度 / 提示音）
   依赖：storage.js（S）
   全局导出：renderPresets() / renderTimer() / startTimer() / stopTimer()
             tRunning / tTotal / tLeft
   ================================================================ */
const CIRC=2*Math.PI*76;
let tTotal=S.timers[0]*60, tLeft=tTotal, tRunning=false, tTimer=null;
function fmtT(s){ s=Math.max(0,Math.ceil(s)); return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0"); }
function renderPresets(){
  const box=document.getElementById("presets"); box.innerHTML="";
  S.timers.forEach((min,i)=>{
    const b=document.createElement("button"); b.className="preset"+(tTotal===min*60&&!tRunning&&tLeft===tTotal?" on":"");
    b.textContent=min+" 分";
    b.onclick=()=>{ if(tRunning) stopTimer(); tTotal=min*60; tLeft=tTotal; renderTimer(); renderPresets(); };
    box.appendChild(b);
  });
}
function renderTimer(){
  document.getElementById("tTime").textContent=fmtT(tLeft);
  document.getElementById("tState").textContent = tRunning?"FOCUS":(tLeft===tTotal?"READY":tLeft===0?"DONE":"PAUSED");
  const ring=document.getElementById("ring");
  ring.classList.toggle("done", tLeft===0&&tTotal>0);
  ring.style.strokeDashoffset = CIRC*(1-(tTotal? tLeft/tTotal:0));
  document.getElementById("tStart").textContent = tRunning?"暂停":"开始";
  document.getElementById("tStart").disabled = (tLeft===0&&!tRunning);
  document.body.dataset.running = tRunning?"1":"0";
}
function tick(){
  tLeft-=1;
  if(tLeft<=0){ tLeft=0; stopTimer(); beep(); renderTimer(); renderPresets(); return; }
  renderTimer();
}
function startTimer(){
  if(tLeft===0) tLeft=tTotal;
  tRunning=true; tTimer=setInterval(tick,1000); renderTimer();
}
function stopTimer(){ tRunning=false; clearInterval(tTimer); renderTimer(); }
function beep(){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)();
    [0,0.35,0.7].forEach(t=>{
      const o=ctx.createOscillator(), g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value=880; o.type="sine";
      g.gain.setValueAtTime(0.001,ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.3,ctx.currentTime+t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.3);
      o.start(ctx.currentTime+t); o.stop(ctx.currentTime+t+0.32);
    });
  }catch(e){}
}
document.getElementById("tStart").onclick=()=> tRunning? stopTimer() : startTimer();
document.getElementById("tReset").onclick=()=>{ stopTimer(); tLeft=tTotal; renderTimer(); renderPresets(); };
