/* SWIR 10.8 BETA — 9.9.2 stable + Friends 10.0 bridge */
(()=>{try{
if(window.__SWIR_BETA108_BOOT)return;window.__SWIR_BETA108_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const STABLE992='c16d6ec57b9063cd9c731f501e5c0cc14adb5c60';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitStable(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=!!((window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_RADAR_DEBUG97);if(ok||n>80)return resolve(ok);setTimeout(tick,150)})()})}
(async()=>{
 await add(CDN+STABLE992+'/swir-stable-992.js?beta108='+Date.now());
 const ok=await waitStable();if(!ok)throw new Error('9.9.2 stable base did not become ready');
 await add(CDN+selfRef+'/swir-friends-108.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.8 BETA — 9.9.2 + FRIENDS 10.0';
 console.log('✅ SWIR 10.8 BETA — pełne 9.9.2 + tylko Friends 10.0 bridge');
})().catch(e=>{console.error('SWIR 10.8 bootstrap',e);alert('SWIR 10.8: błąd startu. Odśwież stronę i wybierz 9.9.2 lub 10.0 w Launcherze.')});
}catch(e){console.error('SWIR 10.8 BETA bootstrap',e)}})();
