/* SWIR 9.9.2 STABLE — frozen 9.9 + R6 theme-aware contrast */
(()=>{try{
if(window.__SWIR_STABLE992_BOOT)return;window.__SWIR_STABLE992_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE='8ef1a5773f98780094c65042c2e622852ea6eb29';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 9.9.2 STABLE load fail',src);document.head.appendChild(s)}
add(CDN+BASE+'/swir.js?stable992='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if(window.SWIR_UI99||n>40){clearInterval(t);window.SWIR_CLOUD_VERSION='9.9.2 STABLE — THEME AWARE CONTRAST';add(CDN+selfRef+'/swir-color-contrast-r6.js?v=stable992')}},200)});
}catch(e){console.error('SWIR 9.9.2 STABLE bootstrap',e)}})();
