/* SWIR 10.15 BETA — GLOBAL ROOMS
 * Frozen 10.6 base + Nick Integrity + Global Rooms Core.
 * Mobile/PC is informational only; every friend follows the same server sync path.
 */
(()=>{try{
if(window.__SWIR_BETA1015_BOOT)return;window.__SWIR_BETA1015_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?b1015='+Date.now());
 await add(CDN+selfRef+'/swir-nick-integrity-1014.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-friends-global-1015.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.15 BETA — GLOBAL ROOMS';
 console.log('SWIR 10.15 ready — all friends use server 85/159 rooms[] path');
})().catch(e=>{console.error('SWIR 10.15 bootstrap',e);alert('SWIR 10.15: błąd startu. Odśwież stronę i wróć do 10.14.')});
}catch(e){console.error('SWIR 10.15 bootstrap',e)}})();
