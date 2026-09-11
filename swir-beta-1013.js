/* SWIR 10.13 BETA — CLEAN RECOVERY
 * Frozen 10.6 base + isolated cleanup of SWIR-injected nick emoji/badges.
 * 10.12 Friends Reliability is intentionally NOT loaded.
 */
(()=>{try{
if(window.__SWIR_BETA1013_BOOT)return;window.__SWIR_BETA1013_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?clean1013='+Date.now());
 await add(CDN+selfRef+'/swir-clean-recovery-1013.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.13 BETA — CLEAN RECOVERY';
 console.log('✅ SWIR 10.13: frozen 10.6 + clean nick recovery; 10.12 not loaded');
})().catch(e=>{console.error('SWIR 10.13 bootstrap',e);alert('SWIR 10.13: błąd startu. Odśwież stronę i wybierz 10.11 lub 10.6.')});
}catch(e){console.error('SWIR 10.13 bootstrap',e)}})();
