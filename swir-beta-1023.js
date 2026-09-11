/* SWIR 10.23 BETA — QUEUE WATCH
 * Frozen 10.6 UI + 10.22 ACK core + bounded queue retries/diagnostics
 * + clean Friends panel + confirmed 10.19 MIX + ICE. STABLE untouched.
 */
(()=>{try{
if(window.__SWIR_BETA1023_BOOT)return;window.__SWIR_BETA1023_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
const NICK_REF='627f38c79ca474f53b266c74fa2136c3f4df7c76';
const ACK_REF='4d8caf877175893ded41d4fd86e487e97c8004f5';
const MIX_REF='30eb32ae756c7692f70323f5f6e0bed7211fbe18';
const ICE_REF='39124e1cfc46a270a1d45a2da6a6b474cd1fc852';
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait(){return new Promise(resolve=>{let n=0;(function t(){n++;const ok=window.SWIR_RADAR_DEBUG97&&window.SWIR_WRITING106&&window.SWIR_COLOR_WRITE&&(window.SWIR_UI99||window.SWIR_UI98);if(ok||n>140)return resolve(!!ok);setTimeout(t,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.23');p.querySelectorAll('.swir99-badge').forEach(x=>x.remove());const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='SWIR MOD';}catch(e){}}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?b1023='+Date.now());
 if(!await wait())throw new Error('10.6 base did not become ready');
 await add(CDN+NICK_REF+'/swir-nick-integrity-1014.js?v='+Date.now());
 await add(CDN+ACK_REF+'/swir-friends-ack-1022.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-friends-queue-1023.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-rooms-panel-1023.js?v='+Date.now());
 await add(CDN+MIX_REF+'/swir-writing-beta-1019.js?v='+Date.now());
 await add(CDN+ICE_REF+'/swir-ice-beta-1018.js?v='+Date.now());
 try{window.SWIR_COLOR_WRITE?.install?.();window.SWIR_MIX1019?.install?.()}catch(e){}
 window.SWIR_CLOUD_VERSION='10.23 BETA';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1023={version:'10.23 BETA',diagnostics:()=>({friends:window.SWIR_FRIENDS_ACK1022?.diagnostics?.(),queue:window.SWIR_QUEUE1023?.diagnostics?.(),rooms:window.SWIR_ROOMS_PANEL1023?.diagnostics?.(),mix:window.SWIR_MIX1019?.diagnostics?.()})};
 console.log('SWIR 10.23 BETA ready — Queue Watch + clean Friends UI');
})().catch(e=>{console.error('SWIR 10.23 bootstrap',e);alert('SWIR 10.23 BETA: błąd startu. Odśwież stronę i wróć do 10.22/10.19 BETA.')});
}catch(e){console.error('SWIR 10.23 bootstrap',e)}})();