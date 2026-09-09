/* SWIR 10.2 BETA — clean rebase on working 10.0 friends + 9.9.1 stable R5 base */
(()=>{try{
if(window.__SWIR_BETA102_BOOT)return;window.__SWIR_BETA102_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const STABLE991='bd40a1f33f565092025a619bfe7742ee55569fba';
const WORKING10='0ed4f9710a435444b8299a03cf6181785c3c66e6';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 10.2 load fail',src);document.head.appendChild(s)}
add(CDN+STABLE991+'/swir-stable-991.js?beta102='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if((window.SWIR_UI99&&window.SWIR_RADAR_DEBUG97&&window.SWIR_COLOR_R5)||n>50){clearInterval(t);add(CDN+WORKING10+'/swir-notify-100-beta.js?v=102',()=>add(CDN+WORKING10+'/swir-mod-tabs-100-beta.js?v=102',()=>add(CDN+WORKING10+'/swir-mod-tabs-100-polish.js?v=102',()=>{window.SWIR_CLOUD_VERSION='10.2 BETA — CLEAN REBASE + FRIENDS FIX';add(CDN+selfRef+'/swir-mod-tabs-102-enhance.js?v='+Date.now())}))) }},200)});
}catch(e){console.error('SWIR 10.2 BETA bootstrap',e)}})();
