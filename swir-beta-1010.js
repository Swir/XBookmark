/* SWIR 10.10 BETA — 10.6 FIX PACK
 * Frozen 10.6 base + reply/nick safety + full B/I/U MIX + Ice readability.
 * Friend Radar is intentionally untouched in this build.
 */
(()=>{try{
if(window.__SWIR_BETA1010_BOOT)return;window.__SWIR_BETA1010_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait106(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=!!(window.SWIR_WRITING106&&window.SWIR_NICKS106&&(window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_RADAR_DEBUG97);if(ok||n>100)return resolve(ok);setTimeout(tick,120)})()})}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?fix1010='+Date.now());
 const ok=await wait106();if(!ok)throw new Error('10.6 base did not become ready');
 await add(CDN+selfRef+'/swir-nick-reply-1010.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-writing-1010.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-ice-1010.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.10 BETA — 10.6 FIX PACK';
 console.log('✅ SWIR 10.10: 10.6 FIX PACK ready; Friends untouched');
})().catch(e=>{console.error('SWIR 10.10 bootstrap',e);alert('SWIR 10.10: błąd startu. Odśwież stronę i wybierz 10.6 lub 10.9.')});
}catch(e){console.error('SWIR 10.10 bootstrap',e)}})();
