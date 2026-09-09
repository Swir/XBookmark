/* SWIR 9.9.1 BETA R2 — lightweight native reply fix (no polling / no attribute observer) */
(()=>{try{
if(window.__SWIR_REPLY_FIX_BETA_R2)return;window.__SWIR_REPLY_FIX_BETA_R2=1;
window.SWIR_REPLY_FIX_BETA_VERSION='9.9.1 BETA R2';
const BAD=['swir-black-chat-text','swir-black-nick'];
const cleanNick=el=>{try{if(!el||!el.classList?.contains('m-msg-item-user-login'))return false;let changed=false;for(const c of BAD){if(el.classList.contains(c)){el.classList.remove(c);changed=true}}return changed}catch(e){return false}};
function cleanExisting(root=document){try{root.querySelectorAll?.('.m-msg-item-user-login.swir-black-chat-text,.m-msg-item-user-login.swir-black-nick').forEach(cleanNick)}catch(e){}}
function cleanFromEvent(e){try{let t=e.target;if(!(t instanceof Element))return;let nick=t.closest?.('.m-msg-item-user-login');if(!nick){const row=t.closest?.('.m-msg-item');nick=row?.querySelector?.('.m-msg-item-user-login')||null}if(nick)cleanNick(nick)}catch(err){}}
let raf=0,queue=new Set();
function schedule(nodes){for(const n of nodes||[])if(n&&n.nodeType===1)queue.add(n);if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const list=[...queue];queue.clear();for(const n of list){if(n.matches?.('.m-msg-item-user-login'))cleanNick(n);n.querySelectorAll?.('.m-msg-item-user-login.swir-black-chat-text,.m-msg-item-user-login.swir-black-nick').forEach(cleanNick)}})}
const mo=new MutationObserver(ms=>{for(const m of ms)if(m.type==='childList'&&m.addedNodes?.length)schedule(m.addedNodes)});
mo.observe(document.body,{childList:true,subtree:true});
['pointerdown','mousedown','contextmenu','click'].forEach(ev=>document.addEventListener(ev,cleanFromEvent,true));
if(!document.getElementById('swirReplyFixBetaR2Css')){const s=document.createElement('style');s.id='swirReplyFixBetaR2Css';s.textContent='.swir-mobile-99{pointer-events:none!important}';document.head.appendChild(s)}
cleanExisting();
window.SWIR_REPLY_FIX_BETA_R2={version:'9.9.1 BETA R2',clean:cleanExisting,diagnostics(){const all=[...document.querySelectorAll('.m-msg-item-user-login')],broken=all.filter(x=>BAD.some(c=>x.classList.contains(c)));const out={version:'9.9.1 BETA R2',messageNicks:all.length,brokenReplyClasses:broken.length,polling:false,attributeObserver:false};console.table(out);return out}};
console.log('✅ SWIR 9.9.1 BETA R2: lekki fix Odpowiedz aktywny');
}catch(e){console.error('SWIR 9.9.1 BETA R2',e)}})();
