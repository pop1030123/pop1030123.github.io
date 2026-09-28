"use strict";
/* ================================================================
   shapes.js — 日历标记的形状图标（内联 SVG）
   全局导出：SHAPES / DEF_SHAPE / SLOTS / shapeSVG()
   ================================================================ */
/* 标签形状：circle 圆形 / triangle 三角形 / square 正方形 / heart 心形 / star 五角星 / diamond 菱形 */
const SHAPES=[["circle","圆形"],["triangle","三角形"],["square","正方形"],["heart","心形"],["star","五角星"],["diamond","菱形"]];
const DEF_SHAPE="circle";
/* 格子内固定槽位：左上/左下/右上/右下/下左/下右 —— 每种形状位置固定 */
const SLOTS=[["circle","lt"],["triangle","lb"],["square","rt"],["heart","rb"],["star","bl"],["diamond","br"]];
function shapeSVG(shape,color,size){
  const s=size||10, fill=(color==="currentColor")?"currentColor":color;
  const paths={
    circle:'<circle cx="6" cy="6" r="5" fill="'+fill+'"/>',
    square:'<rect x="1.4" y="1.4" width="9.2" height="9.2" rx="1.6" fill="'+fill+'"/>',
    triangle:'<path d="M6 1.2 L11 10.4 L1 10.4 Z" fill="'+fill+'"/>',
    star:'<path d="M6 0.8 L7.38 4.5 L11.33 4.67 L8.24 7.13 L9.29 10.93 L6 8.75 L2.71 10.93 L3.76 7.13 L0.67 4.67 L4.62 4.5 Z" fill="'+fill+'"/>',
    heart:'<path d="M6 11 C2 7.8 0.8 5 2.5 3.2 C3.8 1.8 5.5 2.3 6 3.7 C6.5 2.3 8.2 1.8 9.5 3.2 C11.2 5 10 7.8 6 11 Z" fill="'+fill+'"/>',
    diamond:'<path d="M6 0.8 L11.2 6 L6 11.2 L0.8 6 Z" fill="'+fill+'"/>'
  };
  return '<svg viewBox="0 0 12 12" width="'+s+'" height="'+s+'" style="flex:none;display:block">'+(paths[shape]||paths[DEF_SHAPE])+"</svg>";
}
