/* SWIR 10.11 — PHONE BADGE CLEANUP
 * Removes only SWIR-injected phone badges from native CZATeria message nick elements.
 * Does not touch message text, so a real phone emoji typed by a user remains visible.
 */
(()=>{try{
if(window.__SWIR_PHONE_CLEAN1011)return;window.__SWIR_PHONE_CLEAN1011=1;
const NICK='[id^="m-messages_"] .m-msg-item-user-login';
const BADGE='.swir-mobile-99,.swir-mobile-98,.swir-mobile-97,[data-swir-mobile-badge]';
function cleanNick(el){try{
 if(!el?.matches?.(NICK))return 0;
 let n=0;el.querySelectorAll(BADGE).forEach(x=>{x.remove();n++});
 // Safety for an old SWIR-only text node containing just the phone marker.
 [...el.childNodes].forEach(x=>{if(x.nodeType===3&&/^\s*📱\s*$/.test(x.textContent||'')){x.remove();n++}});
 if(n)el.dataset.swir1011PhoneClean='1';
 return n;
}catch(e){return 0}}
function scan(root=document){let n=0;try{
 if(root?.matches?.(NICK))n+=cleanNick(root);
 root?.querySelectorAll?.(NICK).forEach(el=>n+=cleanNick(el));
}catch(e){}return n}
scan();
let queued=false,roots=new Set();
const flush=()=>{queued=false;const a=[...roots];roots.clear();a.forEach(scan)};
new MutationObserver(ms=>{
 for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)roots.add(n);
 if(!queued&&roots.size){queued=true;requestAnimationFrame(flush)}
}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',e=>{const el=e.target?.closest?.(NICK);if(el)cleanNick(el)},true);
document.addEventListener('contextmenu',e=>{const el=e.target?.closest?.(NICK);if(el)cleanNick(el)},true);
window.SWIR_PHONE_CLEAN1011={version:'10.11 PHONE CLEAN',scan:()=>scan(),diagnostics:()=>({remaining:[...document.querySelectorAll(NICK+' '+BADGE)].length})};
console.log('✅ SWIR 10.11: phone badge cleanup active');
}catch(e){console.error('SWIR 10.11 phone cleanup',e)}})();
