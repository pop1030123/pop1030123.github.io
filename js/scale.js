"use strict";
/* ================================================================
   scale.js — 日期/时间卡片内容随卡片尺寸动态缩放
   依赖：无（仅 DOM）

   测量卡片内弹性内容区（date-card-wrap / clock-row），按 基准宽高 计算 --fscale；
   所有字号/数字尺寸均为 calc(基准 × var(--fscale))，卡片变大内容随之变大。
   ≥720px 布局卡片高度由网格分配（container-type:size），不存在反馈循环；
   手机竖屏卡片高度由内容决定，仅按宽度缩放。
   ================================================================ */
(function(){
  const BASE={
    "card-date":{w:300,h:125,inner:".date-card-wrap"},
    "card-time":{w:370,h:125,inner:".clock-row"}
  };
  function applyCardScale(cardId){
    const b=BASE[cardId], card=document.getElementById(cardId);
    if(!card) return;
    const inner=card.querySelector(b.inner);
    if(!inner) return;
    const w=inner.clientWidth, h=inner.clientHeight;
    if(w<=0||h<=0) return;               // 卡片隐藏时跳过
    let s=(window.innerWidth<720)? w/b.w : Math.min(w/b.w,h/b.h);
    s=Math.max(0.55,Math.min(1.6,s));
    card.style.setProperty("--fscale",s.toFixed(3));
  }
  function applyAllScales(){
    applyCardScale("card-date");
    applyCardScale("card-time");
  }
  if(typeof ResizeObserver!=="undefined"){
    const ro=new ResizeObserver(entries=>{
      for(const en of entries){ applyCardScale(en.target.id); }
    });
    ["card-date","card-time"].forEach(id=>{
      const el=document.getElementById(id);
      if(el) ro.observe(el);
    });
  }else{
    /* 旧版 Safari（无 ResizeObserver）回退：用窗口 resize/orientationchange/load 手动计算缩放 */
    function fixBodyHeight(){
      /* 旧版 Safari 没有 100dvh，100vh 会包含浏览器工具栏导致页面溢出 */
      document.body.style.height = window.innerHeight + "px";
    }
    fixBodyHeight();
    window.addEventListener("resize",()=>{ fixBodyHeight(); applyAllScales(); });
    window.addEventListener("orientationchange",()=>{ setTimeout(()=>{ fixBodyHeight(); applyAllScales(); },150); });
    window.addEventListener("load",()=>{ fixBodyHeight(); applyAllScales(); });
    setTimeout(()=>{ fixBodyHeight(); applyAllScales(); },50);
  }
})();
