/* SWIR 10.17.2 STABLE — EXACT FRIENDS + MIX 8/8 + ICE v2
 * IMPORTANT: Friends/Nick core is loaded byte-for-byte from the user-confirmed working 10.17 state.
 * Only isolated Writing MIX and ICE visual overlays are added afterwards.
 */
(()=>{try{
if(window.__SWIR_STABLE10172_BOOT)return;window.__SWIR_STABLE10172_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const EXACT_CORE_REF='627f38c79ca474f53b266c74fa2136c3f4df7c76';
const OVERLAY_REF='341f2be842f7dc0465c4d6190bf2608522d688f6';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitReady(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=window.SWIR_FRIENDS_PRIMARY1017&&window.SWIR_ROOMS_PANEL1017&&window.SWIR_NICK_INTEGRITY1014;if(ok||n>150)return resolve(!!ok);setTimeout(tick,120)})()})}
function paintVersion(){try{
 const p=document.getElementById('configPanel');if(!p)return;
 p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.17.2');
 p.querySelectorAll('.swir99-badge').forEach(x=>x.textContent='STABLE');
 const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub&&/10\.6|beta/i.test(sub.textContent||''))sub.textContent='Radar APK EXACT • MIX 8/8 • ICE v2 • STABLE';
}catch(e){}}
(async()=>{
 await add(CDN+EXACT_CORE_REF+'/swir-beta-1017.js?stable10172='+Date.now());
 const ok=await waitReady();if(!ok)throw new Error('Exact 10.17 Friend Radar core did not become ready');
 await add(CDN+OVERLAY_REF+'/swir-writing-stable-10171.js?v='+Date.now());
 await add(CDN+OVERLAY_REF+'/swir-ice-stable-10172.js?v='+Date.now());
 window.SWIR_CLOUD_VERSION='10.17.2 STABLE — EXACT FRIENDS + MIX 8/8 + ICE v2';
 paintVersion();
 document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paintVersion,30)},true);
 window.SWIR_STABLE10172={version:'10.17.2',coreRef:EXACT_CORE_REF,overlayRef:OVERLAY_REF,paintVersion};
 console.log('SWIR 10.17.2 STABLE ready — exact 10.17 Friends core preserved');
})().catch(e=>{console.error('SWIR 10.17.2 STABLE bootstrap',e);alert('SWIR 10.17.2 STABLE: błąd startu. Odśwież stronę i uruchom ponownie.')});
}catch(e){console.error('SWIR 10.17.2 STABLE bootstrap',e)}})();