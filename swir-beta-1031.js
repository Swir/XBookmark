/* SWIR 10.31 BETA — VIRTUAL ROOMS
 * 10.30 Beta base + isolated group-room layer transported over ordinary private messages.
 * Friends, nickname identity, ACK routing, snapshots, MIX and ICE readability remain unchanged.
 */
(()=>{try{
if(window.__SWIR_BETA1031_BOOT)return;window.__SWIR_BETA1031_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE_REF='783ec8acc4c1e224a376f171d7f88c4f90f8933d';
const ROOMS_REF='115299375d052bdf80d7a013b7306da81a787d0f';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitBase(){return new Promise(resolve=>{let n=0;(function tick(){n++;if(window.SWIR_BETA1030||n>200)return resolve(!!window.SWIR_BETA1030);setTimeout(tick,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.31');p.querySelectorAll('.swir99-badge').forEach(x=>x.remove());const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='SWIR MOD'}catch(e){}}
(async()=>{
 await add(CDN+BASE_REF+'/swir-beta-1030.js?b1031='+Date.now());
 if(!await waitBase())throw new Error('10.30 Beta base did not become ready');
 await add(CDN+ROOMS_REF+'/swir-rooms-1031.js?v='+Date.now());
 if(!window.SWIR_ROOMS1031)throw new Error('Virtual Rooms module did not become ready');
 window.SWIR_CLOUD_VERSION='10.31 BETA — VIRTUAL ROOMS';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1031={version:'10.31 BETA',base:'10.30 BETA',rooms:window.SWIR_ROOMS1031,diagnostics:()=>({base:window.SWIR_BETA1030?.diagnostics?.(),rooms:window.SWIR_ROOMS1031?.diagnostics?.()})};
 console.log('SWIR 10.31 BETA ready — Virtual Rooms');
})().catch(e=>{console.error('SWIR 10.31 bootstrap',e);alert('SWIR 10.31 BETA: błąd startu. Odśwież stronę i wybierz 10.30 BETA lub 10.29 STABLE.')});
}catch(e){console.error('SWIR 10.31 BETA bootstrap',e)}})();
