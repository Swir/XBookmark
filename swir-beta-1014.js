/* SWIR 10.14 BETA — NICK INTEGRITY + FRIENDS CORE
 * Frozen 10.6 base. No 10.12/10.13 UI overlays.
 */
(()=>{try{
if(window.__SWIR_BETA1014_BOOT)return;window.__SWIR_BETA1014_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
(async()=>{await add(CDN+BASE106+'/swir-beta-106.js?b1014='+Date.now());await add(CDN+selfRef+'/swir-nick-integrity-1014.js?v='+Date.now());await add(CDN+selfRef+'/swir-friends-core-1014.js?v='+Date.now());window.SWIR_CLOUD_VERSION='10.14 BETA — NICK INTEGRITY + FRIENDS CORE';console.log('SWIR 10.14 ready')})().catch(e=>{console.error('SWIR 10.14 bootstrap',e);alert('SWIR 10.14: błąd startu. Odśwież stronę i wróć do 10.6.')});
}catch(e){console.error('SWIR 10.14 bootstrap',e)}})();
