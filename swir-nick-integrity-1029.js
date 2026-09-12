/* SWIR 10.29 — SYMBOL-SAFE NICK INTEGRITY
 * Preserves every real nick character, including ':' and other punctuation.
 * Only the single final CZATeria display delimiter ':' is removed while parsing.
 */
(()=>{try{
if(window.__SWIR_NICK_INTEGRITY1029)return;window.__SWIR_NICK_INTEGRITY1029=1;
const SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
let fixed=0,colonSafe=0;
const cleanNoise=v=>String(v??'').replace(/[\u200B-\u200D\u2060\uFEFF]/g,'').replace(/\u00A0/g,' ').replace(/(?:📱|📲|☎)\uFE0F?/gu,'').trim();
function fromNativeText(raw){
 let s=cleanNoise(raw);
 // Native login element is rendered as EXACT_NICK + ': '. Remove only ONE final delimiter.
 if(/:\s*$/.test(s)){s=s.replace(/:\s*$/,'');colonSafe++}
 return cleanNoise(s);
}
function getNick(el){
 try{
  const saved=String(el?.dataset?.swirCanonicalNick1029||'').trim();if(saved)return saved;
  const textNodes=[...(el?.childNodes||[])].filter(n=>n.nodeType===3).map(n=>String(n.textContent||'')).filter(Boolean);
  // Prefer the native text node ending with the display delimiter. Never split on the first colon.
  const raw=textNodes.find(t=>/:\s*$/.test(t)) ?? el?.textContent ?? '';
  return fromNativeText(raw);
 }catch(e){return''}
}
function normalize(el){
 try{
  if(!el?.matches?.(SEL))return false;
  const nick=getNick(el);if(!nick)return false;
  const col=el.getAttribute('data-col'),color=el.style.getPropertyValue('color'),prio=el.style.getPropertyPriority('color');
  el.className='m-msg-item-user-login';
  el.textContent=nick+': ';
  if(col!==null)el.setAttribute('data-col',col);
  if(color)el.style.setProperty('color',color,prio||'important');
  el.dataset.swirCanonicalNick1029=nick;
  el.dataset.swirCanonicalNick=nick;
  el.dataset.swir1029Integrity='1';
  fixed++;return true;
 }catch(e){return false}
}
function scan(root=document){try{if(root?.matches?.(SEL))normalize(root);root?.querySelectorAll?.(SEL).forEach(normalize)}catch(e){}}
if(!document.getElementById('swirNickIntegrity1029Css')){const s=document.createElement('style');s.id='swirNickIntegrity1029Css';s.textContent=`${SEL} .swir-mobile-99,${SEL} .swir-mobile-98,${SEL} .swir-mobile-97,${SEL} [data-swir-mobile-badge],${SEL} [class*="swir-mobile"]{display:none!important}`;document.head.appendChild(s)}
scan();let raf=0,roots=new Set();
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)roots.add(n);if(raf||!roots.size)return;raf=requestAnimationFrame(()=>{raf=0;const a=[...roots];roots.clear();a.forEach(scan)})}).observe(document.body,{childList:true,subtree:true});
const before=e=>{const el=e.target?.closest?.(SEL);if(el)normalize(el)};
document.addEventListener('click',before,true);document.addEventListener('contextmenu',before,true);
const API={version:'10.29 SYMBOL SAFE',scan:()=>scan(),getNick,parse:fromNativeText,diagnostics(){const a=[...document.querySelectorAll(SEL)],withColon=a.filter(el=>String(el.dataset.swirCanonicalNick1029||'').includes(':'));const x={nicks:a.length,withColon:withColon.length,fixed,delimiterParses:colonSafe,badNativeShape:a.filter(el=>el.className!=='m-msg-item-user-login'||el.children.length).length};console.table(x);return x}};
window.SWIR_NICK_INTEGRITY1029=API;window.SWIR_NICK_INTEGRITY1014=API;
console.log('SWIR 10.29 Symbol-Safe Nick Integrity active');
}catch(e){console.error('SWIR 10.29 Symbol-Safe Nick Integrity',e)}})();