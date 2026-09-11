/* SWIR 10.18 BETA — MIX FIX + ICE DARK TEXT — BUILD 2
 * Exact user-confirmed 10.17 Friend Radar + isolated MIX 8/8 single-hook + latest Ice visibility fix.
 */
(()=>{try{
if(window.__SWIR_BETA1018_BOOT)return;window.__SWIR_BETA1018_BOOT=1;
const current=(document.currentScript&&document.currentScript.src)||'',m=current.match(/\/gh\/Swir\/XBookmark@([^/]+)\//),selfRef=m&&m[1]?m[1]:'main';
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const EXACT_CORE_REF='627f38c79ca474f53b266c74fa2136c3f4df7c76';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitCore(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=window.SWIR_FRIENDS_PRIMARY1017&&window.SWIR_ROOMS_PANEL1017&&window.SWIR_NICK_INTEGRITY1014&&window.SWIR_WRITING106;if(ok||n>150)return resolve(!!ok);setTimeout(tick,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.18');p.querySelectorAll('.swir99-badge').forEach(x=>x.textContent='BETA');const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='Radar APK EXACT • MIX 8/8 FIX • ICE DARK TEXT • BETA'}catch(e){}}
(async()=>{
 await add(CDN+EXACT_CORE_REF+'/swir-beta-1017.js?b1018='+Date.now());
 const ok=await waitCore();if(!ok)throw new Error('Exact 10.17 core did not become ready');
 await add(CDN+selfRef+'/swir-writing-beta-1018.js?v='+Date.now());
 await add(CDN+selfRef+'/swir-ice-beta-1018.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.18 BETA — MIX FIX + ICE DARK TEXT';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1018={version:'10.18 BETA BUILD 2',coreRef:EXACT_CORE_REF,selfRef,paint,diagnostics:()=>({friends:window.SWIR_FRIENDS_PRIMARY1017?.diagnostics?.(),mix:window.SWIR_MIX1018?.diagnostics?.(),ice:window.SWIR_ICE1018?.audit?.()})};
 console.log('SWIR 10.18 BETA build 2 ready — exact Friends + MIX hook fix + latest Ice dark text');
})().catch(e=>{console.error('SWIR 10.18 bootstrap',e);alert('SWIR 10.18 BETA: błąd startu. Odśwież stronę i wróć do 10.17 BETA.')});
}catch(e){console.error('SWIR 10.18 bootstrap',e)}})();