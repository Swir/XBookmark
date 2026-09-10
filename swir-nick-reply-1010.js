/* SWIR 10.10 — native nick/reply safety for the 10.6 branch */
(()=>{try{
if(window.__SWIR_NICK_REPLY1010)return;window.__SWIR_NICK_REPLY1010=1;
const SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
const BADGES='.swir-mobile-99,.swir-mobile-98,.swir-mobile-97,[data-swir-mobile-badge]';
function cleanNick(el){try{
 if(!el?.matches?.(SEL))return false;
 el.querySelectorAll(BADGES).forEach(x=>x.remove());
 // Native CZATeria expects innerText to end with exactly ':' and derives nick with slice(0,-1).
 // Do not append SWIR labels/icons inside this element.
 el.dataset.swir1010ReplySafe='1';
 return true;
}catch(e){return false}}
function scan(root=document){try{if(root?.matches?.(SEL))cleanNick(root);root?.querySelectorAll?.(SEL).forEach(cleanNick)}catch(e){}}
function preClean(e){try{const el=e.target?.closest?.(SEL);if(el)cleanNick(el)}catch(x){}}
if(!document.getElementById('swirNickReply1010Css')){const s=document.createElement('style');s.id='swirNickReply1010Css';s.textContent=`${SEL} .swir-mobile-99,${SEL} .swir-mobile-98,${SEL} .swir-mobile-97,${SEL} [data-swir-mobile-badge]{display:none!important;pointer-events:none!important}`;document.head.appendChild(s)}
scan();
let raf=0,pending=new Set();
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)pending.add(n);if(raf||!pending.size)return;raf=requestAnimationFrame(()=>{raf=0;const a=[...pending];pending.clear();a.forEach(scan)})}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',preClean,true);document.addEventListener('contextmenu',preClean,true);
window.SWIR_NICK_REPLY1010={version:'10.10 NICK REPLY SAFE',clean:()=>scan(),diagnostics(){const a=[...document.querySelectorAll(SEL)],bad=a.filter(e=>e.querySelector(BADGES));const x={nicks:a.length,safe:a.filter(e=>e.dataset.swir1010ReplySafe==='1').length,badgesInsideNick:bad.length};console.table(x);return x}};
console.log('✅ SWIR 10.10: nick reply safety active — no badges inside native nick text');
}catch(e){console.error('SWIR 10.10 nick reply',e)}})();
