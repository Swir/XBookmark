/* SWIR 10.11 BETA — UI SAFE CONTROL
 * Exact frozen 10.6 build. No 10.10 overlays.
 * Purpose: restore a fully clickable MOD panel before re-introducing fixes one by one.
 */
(()=>{try{
if(window.__SWIR_BETA1011_BOOT)return;window.__SWIR_BETA1011_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?uiSafe1011='+Date.now());
 window.SWIR_CLOUD_VERSION='10.11 BETA — UI SAFE CONTROL';
 console.log('✅ SWIR 10.11: exact frozen 10.6, no 10.10 overlays');
})().catch(e=>{console.error('SWIR 10.11 bootstrap',e);alert('SWIR 10.11: błąd startu. Odśwież stronę i wybierz 10.6.')});
}catch(e){console.error('SWIR 10.11 bootstrap',e)}})();
