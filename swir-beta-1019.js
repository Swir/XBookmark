/* SWIR 10.19 BETA — COLOR-ALIGNED MIX
 * Exact working 10.17 Friend Radar + MIX channel wrappers matching Color Writing architecture
 * + ICE dark-text overlay from 10.18. Friend Core remains frozen.
 */
(()=>{try{
if(window.__SWIR_BETA1019_BOOT)return;window.__SWIR_BETA1019_BOOT=1;
const CDN='https://cdn.jsdelivr.net/gh/Swir/XBookmark@';
const EXACT_CORE_REF='627f38c79ca474f53b266c74fa2136c3f4df7c76';
const MIX_REF='30eb32ae756c7692f70323f5f6e0bed7211fbe18';
const ICE_REF='39124e1cfc46a270a1d45a2da6a6b474cd1fc852';
function add(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=()=>resolve(src);s.onerror=()=>reject(new Error('load fail: '+src));document.head.appendChild(s)})}
function waitCore(){return new Promise(resolve=>{let n=0;(function tick(){n++;const ok=window.SWIR_FRIENDS_PRIMARY1017&&window.SWIR_ROOMS_PANEL1017&&window.SWIR_NICK_INTEGRITY1014&&window.SWIR_WRITING106&&window.SWIR_COLOR_WRITE;if(ok||n>170)return resolve(!!ok);setTimeout(tick,120)})()})}
function paint(){try{const p=document.getElementById('configPanel');if(!p)return;p.querySelectorAll('.swir99-ver').forEach(x=>x.textContent='v10.19');p.querySelectorAll('.swir99-badge').forEach(x=>x.textContent='BETA');const sub=p.querySelector('.sw10-summary,.swir-summary,[data-swir-summary]');if(sub)sub.textContent='Radar APK EXACT • COLOR-ALIGNED MIX 8/8 • ICE DARK TEXT • BETA'}catch(e){}}
(async()=>{
 await add(CDN+EXACT_CORE_REF+'/swir-beta-1017.js?b1019='+Date.now());
 const ok=await waitCore();if(!ok)throw new Error('Exact 10.17 core / Color Writing did not become ready');
 try{window.SWIR_COLOR_WRITE?.install?.()}catch(e){}
 await add(CDN+MIX_REF+'/swir-writing-beta-1019.js?v='+Date.now());
 await add(CDN+ICE_REF+'/swir-ice-beta-1018.js?v='+Date.now());
 try{window.SWIR_COLOR_WRITE?.install?.();window.SWIR_MIX1019?.install?.()}catch(e){}
 window.SWIR_CLOUD_VERSION='10.19 BETA — COLOR-ALIGNED MIX + ICE DARK TEXT';
 paint();document.addEventListener('click',e=>{if(e.target?.closest?.('#btnConfig'))setTimeout(paint,30)},true);
 window.SWIR_BETA1019={version:'10.19 BETA',coreRef:EXACT_CORE_REF,mixRef:MIX_REF,iceRef:ICE_REF,paint,diagnostics:()=>({friends:window.SWIR_FRIENDS_PRIMARY1017?.diagnostics?.(),mix:window.SWIR_MIX1019?.diagnostics?.(),ice:window.SWIR_ICE1018?.audit?.(),colorMode:window.SWIR_COLOR_WRITE?.getMode?.()||null})};
 console.log('SWIR 10.19 BETA ready — MIX now follows Color Writing channel architecture');
})().catch(e=>{console.error('SWIR 10.19 bootstrap',e);alert('SWIR 10.19 BETA: błąd startu. Odśwież stronę i wróć do 10.17 BETA.')});
}catch(e){console.error('SWIR 10.19 bootstrap',e)}})();