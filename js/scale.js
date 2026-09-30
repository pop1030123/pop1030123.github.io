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
    /* 时间卡片基准改小，使同尺寸容器获得更大 fscale；宽度基准改小以充分利用 iPad 横屏空间 */
    "card-time":{w:320,h:105,inner:".clock-row"},
    /* 天气卡片：直接以整卡为测量对象（inner:null），三行内容随卡片尺寸同步放大 */
    "card-weather":{w:380,h:190,inner:null}
  };
  function applyCardScale(cardId){
    const b=BASE[cardId], card=document.getElementById(cardId);
    if(!card) return;
    const el=b.inner?card.querySelector(b.inner):card;
    if(!el) return;
    const w=el.clientWidth, h=el.clientHeight;
    if(w<=0||h<=0) return;               // 卡片隐藏时跳过
    let s=(window.innerWidth<720)? w/b.w : Math.min(w/b.w,h/b.h);
    s=Math.max(0.55,Math.min(1.8,s));
    card.style.setProperty("--fscale",s.toFixed(3));
  }
  function applyAllScales(){
    applyCardScale("card-date");
    applyCardScale("card-time");
    applyCardScale("card-weather");
  }
  if(typeof ResizeObserver!=="undefined"){
    const ro=new ResizeObserver(entries=>{
      for(const en of entries){ applyCardScale(en.target.id); }
    });
    ["card-date","card-time","card-weather"].forEach(id=>{
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
