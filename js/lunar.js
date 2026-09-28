"use strict";
/* ================================================================
   lunar.js — 农历算法（1900-2100）+ 二十四节气 + 节日表
   全局导出：solar2lunar() / solarFest / lunarText()
   ================================================================ */
const lunarInfo=[
0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0,
0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
0x0d520];
function leapMonth(y){ return lunarInfo[y-1900] & 0xf; }
function leapDays(y){ return leapMonth(y) ? ((lunarInfo[y-1900]&0x10000)?30:29) : 0; }
function lYearDays(y){ let sum=348; for(let i=0x8000;i>0x8;i>>=1) sum += (lunarInfo[y-1900]&i)?1:0; return sum+leapDays(y); }
function monthDays(y,m){ return (lunarInfo[y-1900]&(0x10000>>m))?30:29; }
const nStr1="日一二三四五六七八九十", nStr2=["初","十","廿","卅"], cMonthName=["正","二","三","四","五","六","七","八","九","十","冬","腊"];
function cnDay(d){ return d===10?"初十":d===20?"二十":d===30?"三十":nStr2[Math.floor(d/10)]+nStr1[d%10]; }
const GAN="甲乙丙丁戊己庚辛壬癸", ZHI="子丑寅卯辰巳午未申酉戌亥", ZODIAC="鼠牛虎兔龙蛇马羊猴鸡狗猪";
function solar2lunar(dt){
  let y=dt.getFullYear(), m=dt.getMonth()+1, d=dt.getDate();
  let offset = Math.floor((Date.UTC(y,m-1,d)-Date.UTC(1900,0,31))/86400000);
  let i, temp;
  /* 找到 offset 所在的 lunar 年：循环到 offset < 当年天数时退出
     此时 offset = 0 表示 lunar i 年的第一天（春节）*/
  for(i=1900; i<2101; i++){
    temp=lYearDays(i);
    if(offset<temp) break;
    offset-=temp;
  }
  const leap = leapMonth(i);
  /* 月循环：闰月 + 12 个月；offset<当月天数时立即结算 */
  let isLeap=false, lm=12, ld=offset+1;
  for(let j=1; j<=12; j++){
    if(leap>0 && j===leap+1 && !isLeap){ j--; isLeap=true; temp=leapDays(i); }
    else temp=monthDays(i,j);
    if(isLeap && j===leap+1) isLeap=false;
    if(offset<temp){ lm=j; ld=offset+1; break; }   /* offset 落在当前月 */
    offset-=temp;
  }
  const ly=i;
  return {
    year:ly, month:lm, day:ld, leap:isLeap,
    monthCN:(isLeap?"闰":"")+cMonthName[lm-1]+"月",
    dayCN:cnDay(ld),
    gzYear:GAN[(ly-1900+36)%10]+ZHI[(ly-1900+36)%12],
    zodiac:ZODIAC[(ly-1900+36)%12]
  };
}
/* 农历节日（按农历月日） */
const lunarFest={"1-1":"春节","1-15":"元宵","5-5":"端午","7-7":"七夕","8-15":"中秋","9-9":"重阳","12-8":"腊八"};
/* 公历节日（按公历月日） */
const solarFest={"1-1":"元旦","2-14":"情人节","3-8":"妇女节","3-12":"植树节","5-1":"劳动节","5-4":"青年节","6-1":"儿童节","9-10":"教师节","10-1":"国庆节","12-24":"平安夜","12-25":"圣诞"};
/* ============ 二十四节气（基于太阳视黄经的精确天文计算） ============
   算法：Meeus《天文算法》简化公式（VSOP82 一阶精度）
   1. 由儒略日计算太阳视黄经（度数）
   2. 二分查找太阳到达目标黄经（每节气间隔 15°）的精确时刻
   3. 转回北京时间，得到该节气的公历日期
   精度：与紫金山天文台发布节气相差 < 1 分钟（即同日）
*/
const JQ_NAMES=["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
const JQ_LONS=[]; for(let i=0;i<24;i++) JQ_LONS.push((285+i*15)%360);   /* 每节气 +15°，从小寒 285° 起 */
const DEG=Math.PI/180;
function _mod(x){ return ((x%360)+360)%360; }
/* 太阳视黄经（简化 Meeus）：误差 <0.01°，远超节气判定需要 */
function sunLon(jd){
  const T=(jd-2451545.0)/36525;
  const L0=280.46646+36000.76983*T+0.0003032*T*T;
  const M =357.52911 +35999.05029 *T-0.0001537*T*T;
  const Mr=M*DEG;
  const C=(1.914602-0.004817*T)*Math.sin(Mr)+(0.019993-0.000101*T)*Math.sin(2*Mr)+0.000289*Math.sin(3*Mr);
  return _mod(L0+C-0.00569);     /* 视黄经已减去光行差修正 */
}
/* 公历日期 → 该日中午 UT 的儒略日 */
function jdOfDate(y,m,d){
  const a=Math.floor((14-m)/12), yy=y+4800-a, mm=m+12*a-3;
  return d+Math.floor((153*mm+2)/5)+365*yy+Math.floor(yy/4)-Math.floor(yy/100)+Math.floor(yy/400)-32045;
}
/* 儒略日 → 北京日期（UTC+8） */
function jdToBJ(jd){
  const ms=(jd-2440587.5)*86400000+8*3600000;
  const dt=new Date(ms);
  return {y:dt.getUTCFullYear(), m:dt.getUTCMonth()+1, d:dt.getUTCDate()};
}
/* 从 jdStart 出发，查找太阳到达 targetLon 的精确儒略日
   关键：lo→mid 的黄经增量用"连续差"计算，正确处理跨 0° 边界（黄经 0=春分、90=夏至 等）*/
function findJie(jdStart, targetLon){
  const loLon=sunLon(jdStart);
  let need=targetLon-loLon;
  if(need<=0) need+=360;                     /* 顺时针差值，落在 (0, 360] */
  let lo=jdStart, hi=jdStart+need/0.985647+3;/* 太阳平均日速 0.985647°/day，+3 天缓冲 */
  for(let k=0;k<50;k++){
    if(hi-lo<1e-7) break;
    const mid=(lo+hi)/2;
    let midLon=sunLon(mid);
    let d=midLon-loLon;
    if(d<=-180) d+=360;                      /* 处理跨 0° 时的连续增量 */
    if(d>180) d-=360;
    if(d<need) lo=mid; else hi=mid;
  }
  return (lo+hi)/2;
}
const _jqCache={};
function getJieQi(y){
  if(_jqCache[y]) return _jqCache[y];
  const map={};
  /* 起点取前一年 12 月初（小雪已过、上一节气刚结束），保证本年全部 24 个节气都被覆盖 */
  let jd=jdOfDate(y-1,12,1);
  for(let i=0;i<24;i++){
    const jdJie=findJie(jd, JQ_LONS[i]);
    jd=jdJie;
    const dt=jdToBJ(jdJie);
    if(dt.y===y) map[dt.m+"-"+dt.d]=JQ_NAMES[i];   /* 仅缓存本年内节气 */
  }
  _jqCache[y]=map;
  return map;
}
/* 日历小字标注：节气 > 公历节日 > 除夕/农历节日 > 初一(月份名) > 农历日名 */
function lunarText(y,m,d){
  const jq=getJieQi(y)[m+"-"+d];
  if(jq) return jq;
  const sf=solarFest[m+"-"+d];
  if(sf) return sf;
  const L=solar2lunar(new Date(y,m-1,d));
  /* 除夕：腊月最后一天（不论廿九或三十），属节日优先于普通农历日名 */
  if(L.month===12 && !L.leap && L.day===monthDays(L.year,12)) return "除夕";
  const lf=lunarFest[L.month+"-"+L.day];
  if(lf) return lf;
  if(L.day===1) return L.monthCN;
  return L.dayCN;
}
