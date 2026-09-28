"use strict";
/* ================================================================
   calendar.js — 日历卡片（农历 / 节日 / 多标签标记弹层）
   依赖：storage.js（S / marks / saveMarks / escHtml）
          lunar.js（solar2lunar / lunarText）
          shapes.js（SHAPES / DEF_SHAPE / SLOTS / shapeSVG）
   全局导出：renderCal()
   ================================================================ */
let calY, calM; // 当前查看的年月
(function(){ const n=new Date(); calY=n.getFullYear(); calM=n.getMonth(); })();
function fmtKey(y,m,d){ return y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0"); }
function renderCal(){
  const grid=document.getElementById("calGrid");
  const title=document.getElementById("calTitle");
  title.innerHTML=(calY+"年"+(calM+1)+"月")+"<small>"+solar2lunar(new Date(calY,calM,1)).gzYear+"年</small>";
  grid.innerHTML="";
  const ws=S.weekStart, wdNames= ws===0?["日","一","二","三","四","五","六"]:["一","二","三","四","五","六","日"];
  wdNames.forEach((w,i)=>{
    const dow=(ws+i)%7;                              /* 真实的星期几：0=周日，6=周六 */
    const el=document.createElement("div");
    el.className="cal-wd"+(dow===0||dow===6?" weekend":"");
    el.textContent=w; grid.appendChild(el);
  });
  const first=new Date(calY,calM,1), startDow=(first.getDay()-ws+7)%7;
  const daysInMonth=new Date(calY,calM+1,0).getDate();
  const prevDays=new Date(calY,calM,0).getDate();
  const today=new Date(); const tKey=fmtKey(today.getFullYear(),today.getMonth(),today.getDate());
  const total=Math.ceil((startDow+daysInMonth)/7)*7;
  /* 宽屏（满屏无滚动布局）：星期表头行 auto，日期行随剩余高度均分；手机竖屏交还给 aspect-ratio */
  grid.style.gridTemplateRows=matchMedia("(min-width:720px)").matches
    ? "auto repeat("+(total/7)+",minmax(0,1fr))" : "";
  for(let i=0;i<total;i++){
    let d, out=false, cellY=calY, cellM=calM;
    if(i<startDow){ d=prevDays-startDow+1+i; out=true; cellM-=1; if(cellM<0){cellM=11;cellY-=1;} }
    else if(i>=startDow+daysInMonth){ d=i-startDow-daysInMonth+1; out=true; cellM+=1; if(cellM>11){cellM=0;cellY+=1;} }
    else d=i-startDow+1;
    const cell=document.createElement("div"); cell.className="cal-cell"+(out?" out":"");
    const key=fmtKey(cellY,cellM,d);
    const fest=lunarText(cellY,cellM+1,d);   // cellM 为 0 基，lunarText 需要 1 基月份
    const isFest=/节|旦|夕|宵|中秋|重阳|腊八/.test(fest);
    cell.innerHTML='<span class="d">'+d+'</span><span class="l'+(isFest?" fest":"")+'">'+fest+"</span>";
    if(key===tKey) cell.classList.add("today");
    const tags=marks[key]||[];
    if(tags.length){
      cell.classList.add("marked","has-tags");
      cell.style.borderColor=tags[0].color||"var(--accent)";
      cell.title=tags.map(t=>t.label).filter(Boolean).join("、");
      const byShape={};
      tags.forEach(t=>{const s=t.shape||DEF_SHAPE;(byShape[s]=byShape[s]||[]).push(t);});
      const box=document.createElement("span"); box.className="tagbox";
      const SIDE=["circle","triangle","square","heart"], BOTTOM=["star","diamond"];
      if(tags.some(t=>SIDE.includes(t.shape||DEF_SHAPE))) cell.classList.add("has-side");
      if(tags.some(t=>BOTTOM.includes(t.shape||DEF_SHAPE))) cell.classList.add("has-bottom");
      SLOTS.forEach(([sh,pos])=>{
        const arr=byShape[sh]; if(!arr) return;
        const slot=document.createElement("span"); slot.className="slot "+pos;
        slot.innerHTML=shapeSVG(sh,arr[0].color||"var(--ink-3)",9)+
          (arr.length>1?'<em>'+arr.length+"</em>":"");
        slot.title=arr.map(t=>t.label).filter(Boolean).join("、");
        box.appendChild(slot);
      });
      cell.appendChild(box);
    }
    cell.onclick=(ev)=>{ ev.stopPropagation(); openPop(cell,key); };
    grid.appendChild(cell);
  }
  renderLegend();
}
/* 视口宽度跨越 720px 断点时重新渲染，使日历行高策略（1fr 均分 / aspect-ratio）随之切换 */
try{ matchMedia("(min-width:720px)").addEventListener("change",renderCal); }
catch(e){ matchMedia("(min-width:720px)").addListener(renderCal); }
function renderLegend(){
  const cnt={};
  const prefix=calY+"-"+String(calM+1).padStart(2,"0")+"-";   // 只统计当前查看的月份
  for(const k in marks){ if(k.startsWith(prefix)){ (marks[k]||[]).forEach(t=>{
    const kk=(t.color||"")+"|"+(t.shape||DEF_SHAPE);
    cnt[kk]=(cnt[kk]||0)+1;
  }); } }
  const el=document.getElementById("calLegend");
  const items=Object.entries(cnt).map(([kk,n])=>{
    const p=kk.split("|");
    return '<span>'+shapeSVG(p[1],p[0]||"var(--ink-3)",10)+n+" 个</span>";
  }).join("");
  el.innerHTML = items || '<span>本月暂无标签 · 点击日期可添加（支持多个 / 多种形状）</span>';
}
let popEl=null;
function closePop(){ if(popEl){ popEl.remove(); popEl=null; } }
document.addEventListener("click",e=>{ if(popEl&&!popEl.contains(e.target)) closePop(); });
function openPop(cell,key){
  closePop();
  const tags=marks[key]?marks[key].slice():[];
  const colors=["#c8502f","#d98a1d","#3a8f6d","#3b6fc9","#8e5bc9","#d94f70"];
  const pop=document.createElement("div"); pop.className="pop";
  pop.innerHTML='<h4>'+key+' <small style="color:var(--ink-3);font-weight:400">共 '+tags.length+' 个标签</small></h4>'+
    '<div class="taglist"></div>'+
    '<div class="shapes">'+
    SHAPES.map(([v,name])=>'<span class="sh" data-s="'+v+'" title="'+name+'">'+shapeSVG(v,"currentColor",14)+"</span>").join("")+
    '</div><div class="swatches">'+
    colors.map(c=>'<span class="sw" data-c="'+c+'" style="background:'+c+'"></span>').join("")+
    '</div><input placeholder="新标签名称（可选），如：生日 / 会议…">'+
    '<div class="row"><button class="primary">添加</button><button class="del">清空</button></div>';
  let sel=null, selShape=DEF_SHAPE;
  pop.querySelectorAll(".sh").forEach(s=>s.onclick=(ev)=>{
    ev.stopPropagation();
    selShape = (selShape===s.dataset.s)? DEF_SHAPE : s.dataset.s;
    pop.querySelectorAll(".sh").forEach(x=>x.classList.toggle("on", x.dataset.s===selShape));
  });
  pop.querySelector('.sh[data-s="'+DEF_SHAPE+'"]').classList.add("on");
  function renderTags(){
    const tl=pop.querySelector(".taglist");
    tl.innerHTML=tags.map((t,i)=>'<span class="tag">'+shapeSVG(t.shape||DEF_SHAPE,t.color||"var(--ink-3)",10)+
      escHtml(t.label||"未命名")+'<b data-i="'+i+'" title="删除">✕</b></span>').join("")||
      '<span class="tag-empty">暂无标签</span>';
    tl.querySelectorAll("b").forEach(b=>b.onclick=(ev)=>{
      ev.stopPropagation();
      tags.splice(+b.dataset.i,1); renderTags(); commit();
    });
    pop.querySelector("h4 small").textContent="共 "+tags.length+" 个标签";
  }
  function commit(){
    if(tags.length) marks[key]=tags.slice(); else delete marks[key];
    saveMarks(); renderCal();
  }
  pop.querySelectorAll(".sw").forEach(s=>s.onclick=(ev)=>{
    ev.stopPropagation();
    sel = (sel===s.dataset.c)? null : s.dataset.c;
    pop.querySelectorAll(".sw").forEach(x=>x.classList.toggle("on", x.dataset.c===sel));
  });
  pop.querySelector(".primary").onclick=(ev)=>{
    ev.stopPropagation();
    const inp=pop.querySelector("input");
    const label=inp.value.trim();
    if(!sel&&!label) return;
    tags.push({color:sel,label:label,shape:selShape});
    inp.value=""; sel=null; selShape=DEF_SHAPE;
    pop.querySelectorAll(".sw").forEach(x=>x.classList.remove("on"));
    pop.querySelectorAll(".sh").forEach(x=>x.classList.toggle("on", x.dataset.s===DEF_SHAPE));
    renderTags(); commit(); closePop();
  };
  pop.querySelector(".del").onclick=(ev)=>{ ev.stopPropagation(); tags.length=0; commit(); closePop(); };
  renderTags();
  pop.addEventListener("click",e=>e.stopPropagation());
  document.getElementById("card-calendar").appendChild(pop);
  const cr=cell.getBoundingClientRect(), pr=document.getElementById("card-calendar").getBoundingClientRect();
  pop.style.left=Math.min(cr.left-pr.left, pr.width-212)+"px";
  let top=cr.bottom-pr.top+6;
  const cardEl=document.getElementById("card-calendar");
  if(top+pop.offsetHeight>cardEl.clientHeight-6){
    top=Math.max(6, cr.top-pr.top-pop.offsetHeight-6);   // 底部放不下则向上弹出
  }
  pop.style.top=top+"px";
  popEl=pop;
}
document.getElementById("calPrev").onclick=()=>{ calM--; if(calM<0){calM=11;calY--;} renderCal(); };
document.getElementById("calNext").onclick=()=>{ calM++; if(calM>11){calM=0;calY++;} renderCal(); };
document.getElementById("calToday").onclick=()=>{ const n=new Date(); calY=n.getFullYear(); calM=n.getMonth(); renderCal(); };
