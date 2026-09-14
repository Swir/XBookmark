/* SWIR 10.30 BETA — ICE READABILITY GUARD
 * 10.29 Stable architecture + isolated ICE message contrast repair.
 * Friends, nickname identity, ACK routing, snapshots and MIX remain unchanged.
 */
(()=>{try{
if(window.__SWIR_BETA1030_BOOT)return;window.__SWIR_BETA1030_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const STABLE_REF='d59d32f5c4de212fc6b7022c238ced7e4c719a9c';
const ICE_FIX_REF='5b169e57c886a2dcadc9d1bb558af3f28437e61e';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitStable(){return new Promise(resolve=>{let n=0;(function tick(){n++;if(window.SWIR_STABLE1029||n>180)return resolve(!!window.SWIR_STABLE1029);setTimeout(tick,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.30');p.querySelectorAll('.swir99-badge').forEach(x=>x.remove());const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='SWIR MOD'}catch(e){}}
(async()=>{
 await add(CDN+STABLE_REF+'/swir-stable-1029.js?b1030='+Date.now());
 if(!await waitStable())throw new Error('10.29 Stable base did not become ready');
 await add(CDN+ICE_FIX_REF+'/swir-ice-contrast-1030.js?v='+Date.now());
 try{window.SWIR_ICE_CONTRAST1030?.refresh?.()}catch(e){}
 window.SWIR_CLOUD_VERSION='10.30 BETA — ICE READABILITY GUARD';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1030={version:'10.30 BETA',base:'10.29 STABLE',diagnostics:()=>({stable:window.SWIR_STABLE1029?.diagnostics?.(),ice:window.SWIR_ICE_CONTRAST1030?.audit?.()})};
 console.log('SWIR 10.30 BETA ready — ICE readability guard');
})().catch(e=>{console.error('SWIR 10.30 bootstrap',e);alert('SWIR 10.30 BETA: błąd startu. Odśwież stronę i wybierz 10.29 STABLE.')});
}catch(e){console.error('SWIR 10.30 BETA bootstrap',e)}})();