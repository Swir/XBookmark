/* SWIR 10.17 BETA — APK EXACT ROOMS
 * Frozen 10.6 + Nick Integrity + APK-exact Friend Core + rooms-only panel.
 * Android 2.6.3 aligned: code 8/subcode 4, first normal/open session connection, fresh 85 -> 159 rooms[].
 * Does NOT load 10.15 Global Rooms core.
 */
(()=>{try{
if(window.__SWIR_BETA1017_BOOT)return;window.__SWIR_BETA1017_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@',BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait106(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=String(window.SWIR_CLOUD_VERSION||'').includes('10.6')&&window.SWIR_RADAR_DEBUG97&&(window.SWIR_UI99||window.SWIR_UI98);if(ok||n>100)return resolve(!!ok);setTimeout(tick,150)})()})}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?b1017='+Date.now());
 const ok=await wait106();if(!ok)throw new Error('10.6 base did not become ready');
 await add(CDN+selfRef+'/swir-nick-integrity-1014.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-friends-primary-1017.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-rooms-panel-1017.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.17 BETA — APK EXACT ROOMS';
 console.log('SWIR 10.17 ready — APK-exact Friends transport + rooms only');
})().catch(e=>{console.error('SWIR 10.17 bootstrap',e);alert('SWIR 10.17: błąd startu. Odśwież stronę i wróć do 10.16.')});
}catch(e){console.error('SWIR 10.17 bootstrap',e)}})();
