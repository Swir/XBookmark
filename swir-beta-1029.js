/* SWIR 10.29 BETA — SYMBOL SAFE NICKS
 * 10.28 routing/queue logic + exact nickname identity.
 * Fixes ':' and other punctuation being treated as separators/decoration.
 * MIX 10.19 frozen. STABLE untouched.
 */
(()=>{try{
if(window.__SWIR_BETA1029_BOOT)return;window.__SWIR_BETA1029_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE106='9f6124e32f6a50520f4e9da6c7d504b4dc91d163';
const NICK_REF='0589c6fb6b949e4132e81c0b6e0de8cd5475b456';
const FRIEND_REF='4ff412a6600dfb2d46ba12fb2d18dea8ab5b2b54';
const Q_REF='2d526138c4f9e178c1c3d2ffba4f76f2870bdb27';
const PANEL_REF='96f18948d02c907e5789be4d5514afcfb1d0ee97';
const MERGE_REF='9a8bf6bfed3ef8406baeb136d96116e09eb51f1b';
const MIX_REF='30eb32ae756c7692f70323f5f6e0bed7211fbe18';
const ICE_REF='39124e1cfc46a270a1d45a2da6a6b474cd1fc852';
const ROUTE_TRACE_REF='591336feb3d7a21ce9ce9711c795b724b60446d1';
const ROUTE_GUARD_REF='9ab0d0cd080e999080aaaf97060deec26b9aaafd';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait(){return new Promise(resolve=>{let n=0;(function t(){n++;const ok=window.SWIR_RADAR_DEBUG97&&window.SWIR_WRITING106&&window.SWIR_COLOR_WRITE&&(window.SWIR_UI99||window.SWIR_UI98);if(ok||n>140)return resolve(!!ok);setTimeout(t,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.29');p.querySelectorAll('.swir99-badge').forEach(x=>x.remove());const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='SWIR MOD'}catch(e){}}
(async()=>{
 await add(CDN+BASE106+'/swir-beta-106.js?b1029='+Date.now());
 if(!await wait())throw new Error('10.6 base did not become ready');
 await add(CDN+NICK_REF+'/swir-nick-integrity-1029.js?v='+Date.now());
 await add(CDN+ROUTE_TRACE_REF+'/swir-ack-route-trace-1026.js?v='+Date.now());
 await add(CDN+FRIEND_REF+'/swir-friends-symbol-safe-1029.js?v='+Date.now());
 await add(CDN+ROUTE_GUARD_REF+'/swir-ack-route-guard-1028.js?v='+Date.now());
 await add(CDN+Q_REF+'/swir-friends-queue-1023.js?v='+Date.now());
 await add(CDN+PANEL_REF+'/swir-rooms-panel-1029.js?v='+Date.now());
 await add(CDN+MERGE_REF+'/swir-snapshot-trace-1024.js?v='+Date.now());
 await add(CDN+MERGE_REF+'/swir-snapshot-merge-1029.js?v='+Date.now());
 await add(CDN+MIX_REF+'/swir-writing-beta-1019.js?v='+Date.now());
 await add(CDN+ICE_REF+'/swir-ice-beta-1018.js?v='+Date.now());
 try{window.SWIR_COLOR_WRITE?.install?.();window.SWIR_MIX1019?.install?.();window.SWIR_NICK_INTEGRITY1029?.scan?.()}catch(e){}
 window.SWIR_CLOUD_VERSION='10.29 BETA';paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1029={version:'10.29 BETA',diagnostics:()=>({nick:window.SWIR_NICK_INTEGRITY1029?.diagnostics?.(),friends:window.SWIR_FRIENDS_SYMBOL1029?.diagnostics?.(),queue:window.SWIR_QUEUE1023?.diagnostics?.(),routeGuard:window.SWIR_ACK_ROUTE_GUARD1028?.diagnostics?.(),merge:window.SWIR_SNAPSHOT_MERGE1029?.diagnostics?.(),rooms:window.SWIR_ROOMS_PANEL1029?.diagnostics?.(),mix:window.SWIR_MIX1019?.diagnostics?.()})};
 console.log('SWIR 10.29 BETA ready — symbol-safe nick identity');
})().catch(e=>{console.error('SWIR 10.29 bootstrap',e);alert('SWIR 10.29 BETA: błąd startu. Odśwież stronę i wróć do 10.28 BETA.')});
}catch(e){console.error('SWIR 10.29 bootstrap',e)}})();