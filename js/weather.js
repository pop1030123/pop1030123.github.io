"use strict";
/* ================================================================
   weather.js — 天气卡片（Open-Meteo，免密钥）
   定位链路：浏览器 Geolocation → IP 定位（ipwho.is）→ 北京兜底
   全局导出：fetchWeather()
   ================================================================ */
const WXC={0:["晴","☀️"],1:["大部晴朗","🌤️"],2:["多云","⛅"],3:["阴","☁️"],
45:["雾","🌫️"],48:["雾凇","🌫️"],51:["毛毛雨","🌦️"],53:["毛毛雨","🌦️"],55:["毛毛雨","🌦️"],
56:["冻雨","🌧️"],57:["冻雨","🌧️"],61:["小雨","🌦️"],63:["中雨","🌧️"],65:["大雨","🌧️"],
66:["冻雨","🌧️"],67:["冻雨","🌧️"],71:["小雪","🌨️"],73:["中雪","🌨️"],75:["大雪","❄️"],
77:["米雪","🌨️"],80:["阵雨","🌦️"],81:["阵雨","🌧️"],82:["强阵雨","⛈️"],
85:["阵雪","🌨️"],86:["阵雪","🌨️"],95:["雷阵雨","⛈️"],96:["雷雨伴冰雹","⛈️"],99:["雷雨伴冰雹","⛈️"]};
function wxInfo(code){ return WXC[code]||["—","🌡️"]; }
function fetchWeather(){
  const main=document.getElementById("wxMain");
  main.innerHTML='<div class="wx-err wx-loading">正在获取天气…</div>';
  document.getElementById("wxExtra").innerHTML="";
  document.getElementById("wxDays").innerHTML="";
  const done=(lat,lon,label)=>{
    const url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"+
      "&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4";
    fetch(url).then(r=>r.json()).then(j=>{
      const c=j.current, info=wxInfo(c.weather_code);
      main.innerHTML=
        '<div class="wx-icon">'+info[1]+'</div><div>'+
        '<div class="wx-temp">'+Math.round(c.temperature_2m)+"<sup>°C</sup></div>"+
        '<div class="wx-desc">'+info[0]+"</div>"+
        '<div class="wx-city">'+label+"</div></div>";
      document.getElementById("wxExtra").innerHTML=
        '<div>体感<b>'+Math.round(c.apparent_temperature)+"°</b></div>"+
        '<div>湿度<b>'+c.relative_humidity_2m+"%</b></div>"+
        '<div>风速<b>'+Math.round(c.wind_speed_10m)+"km/h</b></div>";
      const days=j.daily, wd=["周日","周一","周二","周三","周四","周五","周六"];
      let html="";
      for(let i=1;i<4;i++){
        const dd=new Date(days.time[i]);
        html+='<div class="wx-day">'+wd[dd.getDay()]+'<span class="em">'+wxInfo(days.weather_code[i])[1]+"</span><b>"+
          Math.round(days.temperature_2m_min[i])+"° / "+Math.round(days.temperature_2m_max[i])+"°</b></div>";
      }
      document.getElementById("wxDays").innerHTML=html;
    }).catch(()=>{ main.innerHTML='<div class="wx-err">天气获取失败，点击 ↻ 重试</div>'; });
  };
  // 城市名反查（免费、免密钥、支持中文）
  function revName(lat,lon){
    return fetch("https://api.bigdatacloud.net/data/reverse-geocode-client?latitude="+lat+"&longitude="+lon+"&localityLanguage=zh")
      .then(r=>r.json())
      .then(g=>g.city||g.locality||g.principalSubdivision||"")
      .catch(()=>"");
  }
  // 兜底：IP 定位（无需授权），再用坐标反查中文城市名
  function ipLocate(){
    fetch("https://ipwho.is/").then(r=>r.json()).then(j=>{
      if(j && j.success!==false && j.latitude){
        const la=j.latitude.toFixed(3), lo=j.longitude.toFixed(3);
        revName(la,lo).then(n=>done(la,lo,n||j.city||j.region||"IP 定位"));
      }else done(39.9042,116.4074,"北京");
    }).catch(()=>done(39.9042,116.4074,"北京"));
  }
  if(!navigator.geolocation){ ipLocate(); return; }
  navigator.geolocation.getCurrentPosition(
    p=>{
      const la=p.coords.latitude.toFixed(3), lo=p.coords.longitude.toFixed(3);
      revName(la,lo).then(n=>done(la,lo,n||"当前位置"));
    },
    ()=>ipLocate(),       // 用户拒绝授权或超时 → IP 定位
    {timeout:8000}
  );
}
document.getElementById("wxRefresh").onclick=fetchWeather;
setInterval(fetchWeather, 30*60*1000);
