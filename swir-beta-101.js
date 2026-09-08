/* SWIR 10.1 BETA bootstrap — 9.9 stable base + Notify + Clean Tabbed MOD */
(()=>{try{
if(window.__SWIR_BETA101_BOOT)return;window.__SWIR_BETA101_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',STABLE='8ef1a5773f98780094c65042c2e622852ea6eb29';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 10.1 BETA load fail',src);document.head.appendChild(s)}
add(CDN+STABLE+'/swir.js?beta101='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if(((window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_RADAR_DEBUG97)||n>32){clearInterval(t);add(CDN+selfRef+'/swir-notify-100-beta.js?v='+Date.now(),()=>{window.SWIR_CLOUD_VERSION='10.1 BETA — CLEAN UI + COLOR TAB';add(CDN+selfRef+'/swir-mod-tabs-101-beta.js?v='+Date.now(),()=>add(CDN+selfRef+'/swir-mod-tabs-100-polish.js?v='+Date.now()))})}},250)});
}catch(e){console.error('SWIR 10.1 BETA bootstrap',e)}})();