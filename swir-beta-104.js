/* SWIR 10.4 BETA — Friends 2.0 + Fast Themes + native B/I */
(()=>{try{
if(window.__SWIR_BETA104_BOOT)return;window.__SWIR_BETA104_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const STABLE992='c16d6ec57b9063cd9c731f501e5c0cc14adb5c60';
const WORKING10='0ed4f9710a435444b8299a03cf6181785c3c66e6';
const ENHANCE102='2a8aee3a8456335f96423a6d480460507e38ed53';
const BASE103='ea61d5e2a66558bc5bd292bdc79b77ef402d5144';
function add(src,onload){const s=document.createElement('script');s.src=src;s.onload=onload||null;s.onerror=()=>console.error('SWIR 10.4 load fail',src);document.head.appendChild(s)}
add(CDN+STABLE992+'/swir-stable-992.js?beta104='+Date.now(),()=>{let n=0;const t=setInterval(()=>{n++;if((window.SWIR_UI99&&window.SWIR_RADAR_DEBUG97&&window.SWIR_COLOR_R6)||n>50){clearInterval(t);add(CDN+BASE103+'/swir-notify-103-beta.js?v=104',()=>add(CDN+WORKING10+'/swir-mod-tabs-100-beta.js?v=104',()=>add(CDN+WORKING10+'/swir-mod-tabs-100-polish.js?v=104',()=>add(CDN+ENHANCE102+'/swir-mod-tabs-102-enhance.js?v=104',()=>add(CDN+BASE103+'/swir-mod-103-polish.js?v=104',()=>add(CDN+BASE103+'/swir-friend-sync-103.js?v=104',()=>add(CDN+selfRef+'/swir-friends-104.js?v='+Date.now(),()=>add(CDN+selfRef+'/swir-theme-fast-104.js?v='+Date.now(),()=>add(CDN+selfRef+'/swir-text-style-104.js?v='+Date.now(),()=>add(CDN+selfRef+'/swir-mod-104-polish.js?v='+Date.now(),()=>{window.SWIR_CLOUD_VERSION='10.4 BETA — FRIENDS 2.0 + FAST THEMES + NATIVE B/I';console.log('✅ SWIR 10.4 BETA gotowy')}))))))))))}},200)});
}catch(e){console.error('SWIR 10.4 BETA bootstrap',e)}})();
