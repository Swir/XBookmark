/* SWIR 10.21 BETA — HONOUR PATH PROBE
 * Exact 10.20 base + safe honour-path diagnostic/repair overlay.
 * Writing/MIX remains frozen from 10.19 through 10.20.
 */
(()=>{try{
if(window.__SWIR_BETA1021_BOOT)return;window.__SWIR_BETA1021_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const BASE1020='181b05e42630c2fa0168225d8a7d90615595d7b9';
const PROBE_REF='ef8a3225c737ffb46f4e103d106948b6661d03bc';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=window.SWIR_BETA1020&&window.SWIR_FRIEND_GUARD1020&&window.SWIR_FRIENDS_PRIMARY1017&&window.SWIR_MIX1019;if(ok||n>190)return resolve(!!ok);setTimeout(tick,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.21');p.querySelectorAll('.swir99-badge').forEach(x=>x.textContent='BETA');const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='HONOUR PATH PROBE • FRIEND IDENTITY GUARD • MIX 10.19 FROZEN • BETA'}catch(e){}}
(async()=>{
 await add(CDN+BASE1020+'/swir-beta-1020.js?b1021='+Date.now());
 const ok=await wait();if(!ok)throw new Error('10.20 base did not become ready');
 await add(CDN+PROBE_REF+'/swir-friend-honour-probe-1021.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.21 BETA — HONOUR PATH PROBE';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1021={version:'10.21 BETA',base1020:BASE1020,probeRef:PROBE_REF,diagnostics:()=>({probe:window.SWIR_HONOUR_PROBE1021?.diagnostics?.(),guard:window.SWIR_FRIEND_GUARD1020?.diagnostics?.(),friends:window.SWIR_FRIENDS_PRIMARY1017?.diagnostics?.(),rooms:window.SWIR_ROOMS_PANEL1017?.diagnostics?.(),mix:window.SWIR_MIX1019?.diagnostics?.()})};
 console.log('SWIR 10.21 BETA ready — safe Honour Path Probe');
})().catch(e=>{console.error('SWIR 10.21 bootstrap',e);alert('SWIR 10.21 BETA: błąd startu. Odśwież stronę i wróć do 10.20 BETA.')});
}catch(e){console.error('SWIR 10.21 bootstrap',e)}})();