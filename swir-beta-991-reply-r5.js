/* SWIR 9.9.1 BETA R5 bootstrap — frozen 9.9 + readable original colors */
(()=>{try{
if(window.__SWIR_BETA991R5_BOOT)return;window.__SWIR_BETA991R5_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',STABLE='8ef1a5773f98780094c65042c2e622852ea6eb29';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 9.9.1 BETA R5 load fail',src);document.head.appendChild(s)}
add(CDN+STABLE+'/swir.js?r5='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if(window.SWIR_UI99||n>40){clearInterval(t);window.SWIR_CLOUD_VERSION='9.9.1 BETA R5 — COLOR VISIBILITY';add(CDN+selfRef+'/swir-nick-message-colors-beta-r5.js?v='+Date.now())}},200)});
}catch(e){console.error('SWIR 9.9.1 BETA R5 bootstrap',e)}})();
