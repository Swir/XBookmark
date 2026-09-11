/* SWIR 10.12 BETA — FRIENDS RELIABILITY bootstrap
 * Frozen 10.11 UI-safe base + isolated Friends Reliability overlay.
 */
(()=>{try{
if(window.__SWIR_BETA1012_BOOT)return;window.__SWIR_BETA1012_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE1011='799dea8c4870a41219057f4cc555b270a5bb858d';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitBase(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=!!((window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_RADAR_DEBUG97&&window.SWIR_PHONE_CLEAN1011);if(ok||n>100)return resolve(ok);setTimeout(tick,120)})()})}
(async()=>{
 await add(CDN+BASE1011+'/swir-beta-1011.js?beta1012='+Date.now());
 const ok=await waitBase();if(!ok)throw new Error('10.11 base did not become ready');
 await add(CDN+selfRef+'/swir-friends-1012.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.12 BETA — FRIENDS RELIABILITY';
 console.log('✅ SWIR 10.12: UI-safe 10.11 + isolated Friends Reliability');
})().catch(e=>{console.error('SWIR 10.12 bootstrap',e);alert('SWIR 10.12: błąd startu. Odśwież stronę i wybierz 10.11.')});
}catch(e){console.error('SWIR 10.12 bootstrap',e)}})();
