/* SWIR 10.20 BETA — FRIEND IDENTITY GUARD
 * Keeps exact working 10.19 writing/MIX build.
 * Adds canonical friend identity layer before Friends Core starts.
 */
(()=>{try{
if(window.__SWIR_BETA1020_BOOT)return;window.__SWIR_BETA1020_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const GUARD_REF='e3a98cf1743c76b870fdbe6787b1e1c49cba6623';
const BASE1019='345f201a2ceae4a619e8d96e8e5f54e1cbea77b1';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function wait(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=window.SWIR_FRIEND_GUARD1020&&window.SWIR_FRIENDS_PRIMARY1017&&window.SWIR_ROOMS_PANEL1017&&window.SWIR_MIX1019;if(ok||n>180)return resolve(!!ok);setTimeout(tick,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.20');p.querySelectorAll('.swir99-badge').forEach(x=>x.textContent='BETA');const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='FRIEND IDENTITY GUARD • MIX 10.19 FROZEN • APK EXACT ROOMS • BETA'}catch(e){}}
(async()=>{
 await add(CDN+GUARD_REF+'/swir-friend-identity-guard-1020.js?pre='+Date.now());
 await add(CDN+BASE1019+'/swir-beta-1019.js?b1020='+Date.now());
 const ok=await wait();if(!ok)throw new Error('10.20 components did not become ready');
 try{window.SWIR_FRIEND_GUARD1020?.cleanFriends?.();window.SWIR_FRIEND_GUARD1020?.cleanIdCache?.();window.SWIR_FRIEND_GUARD1020?.patchConnections?.();window.SWIR_FRIENDS_PRIMARY1017?.syncAll?.();setTimeout(()=>window.SWIR_FRIENDS_PRIMARY1017?.refresh?.(),400)}catch(e){}
 window.SWIR_CLOUD_VERSION='10.20 BETA — FRIEND IDENTITY GUARD';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1020={version:'10.20 BETA',base1019:BASE1019,guardRef:GUARD_REF,diagnostics:()=>({guard:window.SWIR_FRIEND_GUARD1020?.diagnostics?.(),friends:window.SWIR_FRIENDS_PRIMARY1017?.diagnostics?.(),rooms:window.SWIR_ROOMS_PANEL1017?.diagnostics?.(),mix:window.SWIR_MIX1019?.diagnostics?.()})};
 console.log('SWIR 10.20 BETA ready — 10.19 writing frozen + Friend Identity Guard');
})().catch(e=>{console.error('SWIR 10.20 bootstrap',e);alert('SWIR 10.20 BETA: błąd startu. Odśwież stronę i wróć do 10.19 BETA.')});
}catch(e){console.error('SWIR 10.20 bootstrap',e)}})();