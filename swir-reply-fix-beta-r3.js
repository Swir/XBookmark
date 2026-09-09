/* SWIR 9.9.1 BETA R3 — event-only native nick compatibility */
(()=>{try{
if(window.__SWIR_REPLY_FIX_BETA_R3)return;window.__SWIR_REPLY_FIX_BETA_R3=1;
window.SWIR_REPLY_FIX_BETA_VERSION='9.9.1 BETA R3';
const BASE='m-msg-item-user-login';
function isNormalNick(el){return !!(el&&el.nodeType===1&&el.classList?.contains(BASE)&&!el.classList.contains('m-msg-item-image-user-login'))}
function normalize(el){
 try{
  if(!isNormalNick(el))return false;
  if(el.className!==BASE){el.className=BASE;return true}
  return false;
 }catch(e){return false}
}
function nickFromTarget(t){
 try{
  if(!(t instanceof Element))return null;
  return t.matches?.('.'+BASE)?t:t.closest?.('.'+BASE)||null;
 }catch(e){return null}
}
function beforeNative(e){try{const n=nickFromTarget(e.target);if(n)normalize(n)}catch(err){}}
if(!document.getElementById('swirReplyFixBetaR3Css')){
 const s=document.createElement('style');s.id='swirReplyFixBetaR3Css';
 s.textContent='.m-msg-item-user-login:not(.m-msg-item-image-user-login)>*{pointer-events:none!important}';
 document.head.appendChild(s);
}
try{document.querySelectorAll('.m-msg-item-user-login:not(.m-msg-item-image-user-login)').forEach(normalize)}catch(e){}
['pointerdown','mousedown','contextmenu','click'].forEach(ev=>document.addEventListener(ev,beforeNative,true));
window.SWIR_REPLY_FIX_BETA_R3={version:'9.9.1 BETA R3',normalize,diagnostics(){
 const all=[...document.querySelectorAll('.m-msg-item-user-login:not(.m-msg-item-image-user-login)')];
 const extra=all.filter(x=>x.className!==BASE);
 const out={version:'9.9.1 BETA R3',messageNicks:all.length,nicksWithExtraClasses:extra.length,polling:false,observer:false};
 console.table(out); if(extra.length)console.log('SWIR R3 extra classes',extra.slice(0,20).map(x=>({text:x.textContent,className:x.className})));
 return out;
}};
console.log('✅ SWIR 9.9.1 BETA R3: event-only native nick compatibility active');
}catch(e){console.error('SWIR 9.9.1 BETA R3',e)}})();
