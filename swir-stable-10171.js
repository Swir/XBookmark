/* SWIR 10.17.1 STABLE — APK EXACT ROOMS + MIX 8/8 + ICE COLOR REWORK
 * Frozen, tested Friend Radar core from 10.17 plus isolated writing/theme improvements.
 */
(()=>{try{
if(window.__SWIR_STABLE10171_BOOT)return;window.__SWIR_STABLE10171_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const CORE_REF='3b08ed1d4fdb929bba1a0d3046180452395ef56d';
const OVERLAY_REF='f97c1d4eac01f412d1da3c9d2ecd9a38595f07a8';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitReady(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=window.SWIR_FRIENDS_PRIMARY1017&&window.SWIR_ROOMS_PANEL1017&&window.SWIR_NICK_INTEGRITY1014;if(ok||n>140)return resolve(!!ok);setTimeout(tick,120)})()})}
(async()=>{
 await add(CDN+CORE_REF+'/swir-beta-1017.js?stable10171='+Date.now());
 const ok=await waitReady();if(!ok)throw new Error('APK Exact Rooms core did not become ready');
 await add(CDN+OVERLAY_REF+'/swir-writing-stable-10171.js?v='+Date.now());
 await add(CDN+OVERLAY_REF+'/swir-ice-stable-10171.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.17.1 STABLE — APK EXACT ROOMS + MIX 8/8 + ICE';
 console.log('SWIR 10.17.1 STABLE ready');
})().catch(e=>{console.error('SWIR 10.17.1 STABLE bootstrap',e);alert('SWIR 10.17.1 STABLE: błąd startu. Odśwież stronę i uruchom ponownie.')});
}catch(e){console.error('SWIR 10.17.1 STABLE bootstrap',e)}})();