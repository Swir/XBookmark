/* SWIR 10.7 BETA — CLEAN REBASE bootstrap
 * Exactly two layers: frozen working 10.0 beta + one 10.7 overlay.
 */
(()=>{try{
if(window.__SWIR_BETA107_BOOT)return;window.__SWIR_BETA107_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const WORKING10='0ed4f9710a435444b8299a03cf6181785c3c66e6';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitBase(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=(window.SWIR_RADAR_DEBUG97&&(window.SWIR_UI99||window.SWIR_UI98)&&window.SWIR_NOTIFY100&&document.querySelector('#configPanel #swirModTabs100'));if(ok||n>80)return resolve(!!ok);setTimeout(tick,125)})()})}
(async()=>{
 await add(CDN+WORKING10+'/swir-beta-10.js?clean107='+Date.now());
 const ok=await waitBase();if(!ok)throw new Error('10.0 base did not become ready');
 await add(CDN+selfRef+'/swir-clean-107.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.7 BETA — CLEAN REBASE';
 console.log('✅ SWIR 10.7: frozen 10.0 base + one clean overlay');
})().catch(e=>{console.error('SWIR 10.7 bootstrap',e);alert('SWIR 10.7: błąd startu. Odśwież stronę i wybierz 10.6 lub 9.9.2 w Launcherze.')});
}catch(e){console.error('SWIR 10.7 BETA bootstrap',e)}})();
