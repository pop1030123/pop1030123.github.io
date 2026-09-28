"use strict";
/* ================================================================
   clock.js — 时间卡片（翻转 / 上滑两种动画）
   依赖：storage.js（S）
   全局导出：buildClock() / renderClock()
   ================================================================ */
const clockEl = document.getElementById("clock");
function buildClock(){
  clockEl.innerHTML="";
  const parts=["h1","h2","m1","m2","s1","s2"];
  parts.forEach((p,idx)=>{
    if(idx===2||idx===4){
      const c=document.createElement("span"); c.className="colon"; c.textContent=":"; clockEl.appendChild(c);
    }
    const d=document.createElement("div"); d.className="digit"; d.dataset.pos=p; d.dataset.v="";
    d.innerHTML =
      '<span class="half top top-old"><b>0</b></span>'+
      '<span class="half top top-new"><b>0</b></span>'+
      '<span class="half bottom bottom-old"><b>0</b></span>'+
      '<span class="half bottom bottom-new"><b>0</b></span>';
    clockEl.appendChild(d);
  });
}
function setDigit(el,val){
  if(S.anim==="slide"){
    if(el.dataset.v===val) return;
    const oldV=el.dataset.v;
    el.dataset.v=val;
    if(oldV===""){                       // 首次渲染：直接显示
      el.innerHTML='<span class="sl">'+val+"</span>";
    }else{                               // 旧数字上滑出，新数字自下滑入
      el.innerHTML='<span class="sl out">'+oldV+'</span><span class="sl in">'+val+"</span>";
    }
    return;
  }
  if(el.dataset.v===""){          // 首次渲染：直接显示，不做翻转动画
    el.dataset.v=val;
    el.querySelectorAll("b").forEach(b=>b.textContent=val);
    return;
  }
  const cur=el.dataset.v;
  if(cur===val) return;
  el.dataset.v=val;
  el.querySelector(".top-old b").textContent=cur;
  el.querySelector(".bottom-old b").textContent=cur;
  el.querySelector(".top-new b").textContent=val;
  el.querySelector(".bottom-new b").textContent=val;
  el.classList.remove("flip"); void el.offsetWidth; el.classList.add("flip");
}
function renderClock(){
  const n=new Date(), p2=x=>String(x).padStart(2,"0");
  const t=[p2(n.getHours())[0],p2(n.getHours())[1],p2(n.getMinutes())[0],p2(n.getMinutes())[1],p2(n.getSeconds())[0],p2(n.getSeconds())[1]];
  const digits=clockEl.querySelectorAll(".digit");
  t.forEach((v,i)=>setDigit(digits[i],v));
}
