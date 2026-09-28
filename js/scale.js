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
  if(typeof ResizeObserver==="undefined") return;   /* 旧版 Safari 无 ResizeObserver：跳过动态缩放，内容仍正常显示 */
  const BASE={
    "card-date":{w:300,h:125,inner:".date-card-wrap"},
    "card-time":{w:370,h:125,inner:".clock-row"}
  };
  const ro=new ResizeObserver(entries=>{
    for(const en of entries){
      const card=en.target, b=BASE[card.id];
      if(!b) continue;
      const inner=card.querySelector(b.inner);
      if(!inner) continue;
      const w=inner.clientWidth, h=inner.clientHeight;
      if(w<=0||h<=0) continue;               // 卡片隐藏时跳过，显示时 RO 会再次触发
      let s=(window.innerWidth<720)? w/b.w : Math.min(w/b.w,h/b.h);
      s=Math.max(0.55,Math.min(1.6,s));
      card.style.setProperty("--fscale",s.toFixed(3));
    }
  });
  ["card-date","card-time"].forEach(id=>{
    const el=document.getElementById(id);
    if(el) ro.observe(el);
  });
})();
