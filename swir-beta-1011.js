/* SWIR 10.11 BETA — UI SAFE + PHONE CLEAN
 * Frozen 10.6 build + one isolated, non-invasive cleanup:
 * remove only SWIR-injected phone badges from native message nick elements.
 * No 10.10 writing, Ice or reply overlays. Friends remain untouched.
 */
(()=>{try{
if(window.__SWIR_BETA1011_BOOT)return;window.__SWIR_BETA1011_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'';
const m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//);
const selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?uiSafe1011='+Date.now());
 await add(CDN+selfRef+'/swir-phone-clean-1011.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.11 BETA — UI SAFE + PHONE CLEAN';
 console.log('✅ SWIR 10.11: frozen 10.6 + isolated phone badge cleanup; Friends untouched');
})().catch(e=>{console.error('SWIR 10.11 bootstrap',e);alert('SWIR 10.11: błąd startu. Odśwież stronę i wybierz 10.6.')});
}catch(e){console.error('SWIR 10.11 bootstrap',e)}})();
