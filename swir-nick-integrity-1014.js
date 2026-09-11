/* SWIR 10.14 — NICK INTEGRITY
 * Keep native CZATeria message nick DOM exact: class=m-msg-item-user-login, text=Nick: 
 * No SWIR emoji/badges/children are allowed inside native message login elements.
 */
(()=>{try{
if(window.__SWIR_NICK_INTEGRITY1014)return;window.__SWIR_NICK_INTEGRITY1014=1;
const SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
let fixed=0;
try{localStorage.removeItem('swir_friend_reliability_1012')}catch(e){}
function getNick(el){
 try{
  const saved=String(el?.dataset?.swirCanonicalNick||'').trim();
  if(saved)return saved;
  const first=[...(el?.childNodes||[])].find(n=>n.nodeType===3&&String(n.textContent||'').includes(':'));
  let raw=String(first?.textContent||el?.textContent||'').trim();
  const pos=raw.indexOf(':');
  if(pos>=0)raw=raw.slice(0,pos);
  raw=raw.replace(/(?:📱|📲|☎️?)/gu,'').trim();
  return raw;
 }catch(e){return''}
}
function normalize(el){
 try{
  if(!el?.matches?.(SEL))return false;
  const nick=getNick(el);if(!nick)return false;
  const col=el.getAttribute('data-col');
  const color=el.style.getPropertyValue('color'),prio=el.style.getPropertyPriority('color');
  el.className='m-msg-item-user-login';
  el.textContent=nick+': ';
  if(col!==null)el.setAttribute('data-col',col);
  if(color)el.style.setProperty('color',color,prio||'important');
  el.dataset.swirCanonicalNick=nick;
  el.dataset.swir99nick='1';
  el.dataset.swir1014Integrity='1';
  fixed++;
  return true;
 }catch(e){return false}
}
function scan(root=document){try{if(root?.matches?.(SEL))normalize(root);root?.querySelectorAll?.(SEL).forEach(normalize)}catch(e){}}
if(!document.getElementById('swirNickIntegrity1014Css')){const s=document.createElement('style');s.id='swirNickIntegrity1014Css';s.textContent=`${SEL} .swir-mobile-99,${SEL} .swir-mobile-98,${SEL} .swir-mobile-97,${SEL} [data-swir-mobile-badge],${SEL} [class*="swir-mobile"]{display:none!important}`;document.head.appendChild(s)}
scan();
let raf=0,roots=new Set();
new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)roots.add(n);if(raf||!roots.size)return;raf=requestAnimationFrame(()=>{raf=0;const a=[...roots];roots.clear();a.forEach(scan)})}).observe(document.body,{childList:true,subtree:true});
const before=e=>{const el=e.target?.closest?.(SEL);if(el)normalize(el)};
document.addEventListener('click',before,true);
document.addEventListener('contextmenu',before,true);
window.SWIR_NICK_INTEGRITY1014={version:'10.14 NICK INTEGRITY',scan:()=>scan(),diagnostics(){const a=[...document.querySelectorAll(SEL)];const bad=a.filter(el=>el.className!=='m-msg-item-user-login'||el.children.length||!/^.+:\s*$/.test(el.textContent||''));const x={nicks:a.length,normalized:a.filter(el=>el.dataset.swir1014Integrity==='1').length,badNativeShape:bad.length,fixed};console.table(x);return x}};
console.log('SWIR 10.14 Nick Integrity active');
}catch(e){console.error('SWIR 10.14 Nick Integrity',e)}})();
