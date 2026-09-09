/* SWIR 10.3 BETA — Friend Notify Rebuild on 9.9.2 + working 10.0 tabs */
(()=>{try{
if(window.__SWIR_BETA103_BOOT)return;window.__SWIR_BETA103_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const STABLE992='c16d6ec57b9063cd9c731f501e5c0cc14adb5c60';
const WORKING10='0ed4f9710a435444b8299a03cf6181785c3c66e6';
const ENHANCE102='2a8aee3a8456335f96423a6d480460507e38ed53';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 10.3 load fail',src);document.head.appendChild(s)}
add(CDN+STABLE992+'/swir-stable-992.js?beta103='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if((window.SWIR_UI99&&window.SWIR_RADAR_DEBUG97&&window.SWIR_COLOR_R6)||n>50){clearInterval(t);add(CDN+selfRef+'/swir-notify-103-beta.js?v='+Date.now(),()=>add(CDN+WORKING10+'/swir-mod-tabs-100-beta.js?v=103',()=>add(CDN+WORKING10+'/swir-mod-tabs-100-polish.js?v=103',()=>add(CDN+ENHANCE102+'/swir-mod-tabs-102-enhance.js?v=103',()=>{window.SWIR_CLOUD_VERSION='10.3 BETA — FRIEND NOTIFY REBUILD';add(CDN+selfRef+'/swir-mod-103-polish.js?v='+Date.now(),()=>add(CDN+selfRef+'/swir-friend-sync-103.js?v='+Date.now()))}))))}},200)});
}catch(e){console.error('SWIR 10.3 BETA bootstrap',e)}})();
