/* SWIR 9.9.1 BETA R3 bootstrap — frozen 9.9 + event-only native nick fix */
(()=>{try{
if(window.__SWIR_BETA991R3_BOOT)return;window.__SWIR_BETA991R3_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',STABLE='8ef1a5773f98780094c65042c2e622852ea6eb29';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 9.9.1 BETA R3 load fail',src);document.head.appendChild(s)}
add(CDN+STABLE+'/swir.js?replybeta3='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if(window.SWIR_UI99||n>40){clearInterval(t);window.SWIR_CLOUD_VERSION='9.9.1 BETA R3 — NATIVE NICK FIX';add(CDN+selfRef+'/swir-reply-fix-beta-r3.js?v='+Date.now())}},200)});
}catch(e){console.error('SWIR 9.9.1 BETA R3 bootstrap',e)}})();
