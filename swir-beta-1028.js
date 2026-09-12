/* SWIR 10.28 BETA — ACK ROUTE GUARD
 * Safer per-socket ACK routing. Replaces the 10.27 global lastAck pin.
 * No timing changes. MIX 10.19 frozen. Honour Probe removed. STABLE untouched.
 */
(()=>{try{
if(window.__SWIR_BETA1028_BOOT)return;window.__SWIR_BETA1028_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
const NICK_REF='627f38c79ca474f53b266c74fa2136c3f4df7c76';
const ACK_REF='4d8caf877175893ded41d4fd86e487e97c8004f5';
const Q_REF='2d526138c4f9e178c1c3d2ffba4f76f2870bdb27';
const MIX_REF='30eb32ae756c7692f70323f5f6e0bed7211fbe18';
const ICE_REF='39124e1cfc46a270a1d45a2da6a6b474cd1fc852';
const MERGE_REF='3cd39d15fcf8406009efe4f959f690c64caf2fb7';
const ROUTE_TRACE_REF='591336feb3d7a21ce9ce9711c795b724b60446d1';
const ROUTE_GUARD_REF='9ab0d0cd080e999080aaaf97060deec26b9aaafd';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait(){return new Promise(resolve=>{let n=0;(function t(){n++;const ok=window.SWIR_RADAR_DEBUG97&&window.SWIR_WRITING106&&window.SWIR_COLOR_WRITE&&(window.SWIR_UI99||window.SWIR_UI98);if(ok||n>140)return resolve(!!ok);setTimeout(t,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.28');p.querySelectorAll('.swir99-badge').forEach(x=>x.remove());const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='SWIR MOD';}catch(e){}}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?b1028='+Date.now());
 if(!await wait())throw new Error('10.6 base did not become ready');
 await add(CDN+NICK_REF+'/swir-nick-integrity-1014.js?v='+Date.now());
 await add(CDN+ROUTE_TRACE_REF+'/swir-ack-route-trace-1026.js?v='+Date.now());
 await add(CDN+ACK_REF+'/swir-friends-ack-1022.js?v='+Date.now());
 await add(CDN+ROUTE_GUARD_REF+'/swir-ack-route-guard-1028.js?v='+Date.now());
 await add(CDN+Q_REF+'/swir-friends-queue-1023.js?v='+Date.now());
 await add(CDN+Q_REF+'/swir-rooms-panel-1023.js?v='+Date.now());
 await add(CDN+MERGE_REF+'/swir-snapshot-trace-1024.js?v='+Date.now());
 await add(CDN+MERGE_REF+'/swir-snapshot-merge-1025.js?v='+Date.now());
 await add(CDN+MIX_REF+'/swir-writing-beta-1019.js?v='+Date.now());
 await add(CDN+ICE_REF+'/swir-ice-beta-1018.js?v='+Date.now());
 try{window.SWIR_COLOR_WRITE?.install?.();window.SWIR_MIX1019?.install?.()}catch(e){}
 window.SWIR_CLOUD_VERSION='10.28 BETA';paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1028={version:'10.28 BETA',diagnostics:()=>({friends:window.SWIR_FRIENDS_ACK1022?.diagnostics?.(),queue:window.SWIR_QUEUE1023?.diagnostics?.(),routeTrace:window.SWIR_ACK_ROUTE_TRACE1026?.diagnostics?.(),routeGuard:window.SWIR_ACK_ROUTE_GUARD1028?.diagnostics?.(),snapshot:window.SWIR_SNAPSHOT_TRACE1024?.diagnostics?.(),merge:window.SWIR_SNAPSHOT_MERGE1025?.diagnostics?.(),rooms:window.SWIR_ROOMS_PANEL1023?.diagnostics?.(),mix:window.SWIR_MIX1019?.diagnostics?.()})};
 console.log('SWIR 10.28 BETA ready — ACK Route Guard');
})().catch(e=>{console.error('SWIR 10.28 bootstrap',e);alert('SWIR 10.28 BETA: błąd startu. Odśwież stronę i wróć do 10.27 BETA.')});
}catch(e){console.error('SWIR 10.28 bootstrap',e)}})();