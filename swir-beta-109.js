/* SWIR 10.9 BETA — 9.9.2 control build, untouched Friend Radar */
(()=>{try{
if(window.__SWIR_BETA109_BOOT)return;window.__SWIR_BETA109_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const STABLE992='c16d6ec57b9063cd9c731f501e5c0cc14adb5c60';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitReady(){return new Promise(resolve=>{let n=0;(function tick(){n++;const r=window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;const ok=!!((window.SWIR_UI99||window.SWIR_UI98)&&r);if(ok||n>80)return resolve(ok);setTimeout(tick,150)})()})}
(async()=>{
 await add(CDN+STABLE992+'/swir-stable-992.js?beta109='+Date.now());
 const ok=await waitReady();if(!ok)throw new Error('9.9.2 did not become ready');
 const r=window.SWIR_RADAR_DEBUG97||window.SWIR_FRIEND_RADAR;
 window.SWIR_CLOUD_VERSION='10.9 BETA — 9.9.2 + UNTOUCHED FRIEND RADAR';
 window.SWIR_BETA109_DIAGNOSTICS={version:'10.9',radarVersion:r?.version||null,radarObject:r,info:'No friend bridge, no click interception, no extra refresh timers'};
 console.log('✅ SWIR 10.9 BETA — 9.9.2 bez zmian; Friend Radar działa natywnie',window.SWIR_BETA109_DIAGNOSTICS);
})().catch(e=>{console.error('SWIR 10.9 bootstrap',e);alert('SWIR 10.9: błąd startu. Odśwież stronę i wybierz 9.9.2 lub 10.0.')});
}catch(e){console.error('SWIR 10.9 BETA bootstrap',e)}})();
