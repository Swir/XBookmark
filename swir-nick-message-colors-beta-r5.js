/* SWIR 9.9.1 BETA R5 — original colors + stronger readability; native-click safe */
(()=>{try{
if(window.__SWIR_COLOR_R5)return;window.__SWIR_COLOR_R5=1;
window.SWIR_COLOR_R5_VERSION='9.9.1 BETA R5 — COLOR VISIBILITY';

const NICK_SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
const MSG_SEL='[id^="m-messages_"] .m-msg-item-user-message';

function rgb(c){const m=String(c||'').match(/rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);return m?[+m[1],+m[2],+m[3]]:null}
function out(a){return `rgb(${a[0]}, ${a[1]}, ${a[2]})`}
function clamp(v){return Math.max(0,Math.min(255,Math.round(v)))}
function mixWhite(a,k){return a.map(v=>clamp(v+(255-v)*k))}
function luminance(a){return .2126*a[0]+.7152*a[1]+.0722*a[2]}
function isNearBlack(a){return Math.max(...a)<=52 || (luminance(a)<58 && Math.max(...a)-Math.min(...a)<32)}
function isDarkNavy(a){const [r,g,b]=a,L=luminance(a);return b>=72&&b>r*1.28&&b>g*1.13&&(b-r)>=38&&L<145}

function brightenNick(a){
  if(isNearBlack(a))return [244,247,250];
  if(isDarkNavy(a))return [104,204,255]; // granat -> jasny gamingowy błękit
  const L=luminance(a);
  if(L<85)return mixWhite(a,.48);
  if(L<125)return mixWhite(a,.34);
  if(L<165)return mixWhite(a,.20);
  return mixWhite(a,.08);
}
function brightenMessage(a){
  if(isNearBlack(a))return [235,241,247];
  if(isDarkNavy(a))return [110,200,255]; // ciemnoniebieskie pisanie staje się czytelne
  const L=luminance(a);
  if(L<90)return mixWhite(a,.52);
  if(L<130)return mixWhite(a,.38);
  if(L<170)return mixWhite(a,.24);
  return mixWhite(a,.10);
}

function normalizeNick(el){
  try{
    if(!el||!el.matches?.('.m-msg-item-user-login:not(.m-msg-item-image-user-login)'))return false;
    // Natywny parser CZATerii oczekuje dokładnie tej klasy i czystego tekstu loginu.
    if(el.className!=='m-msg-item-user-login')el.className='m-msg-item-user-login';
    el.querySelectorAll('.swir-mobile-99,.swir-mobile-96,.swir-mobile-r4,.swir-mobile-r5').forEach(x=>x.remove());
    el.dataset.swir99nick='1';
    ['color','text-shadow','font-weight','animation','transition','filter'].forEach(p=>el.style.removeProperty(p));
    const base=getComputedStyle(el).color,r=rgb(base);if(!r)return false;
    const b=brightenNick(r);
    el.dataset.swirR5NickOriginal=base;
    el.dataset.swirR5NickColor=out(b);
    el.style.setProperty('color',out(b),'important');
    el.style.setProperty('font-weight','750','important');
    el.style.setProperty('text-shadow','0 0 2px rgba(255,255,255,.07)','important');
    return true;
  }catch(e){return false}
}

function normalizeMessage(el){
  try{
    if(!el||!el.matches?.('.m-msg-item-user-message'))return false;
    // Nie zmieniamy klas ani data-col — tylko wizualny kolor tekstu.
    ['color','text-shadow','filter'].forEach(p=>el.style.removeProperty(p));
    const base=getComputedStyle(el).color,r=rgb(base);if(!r)return false;
    const b=brightenMessage(r);
    el.dataset.swirR5MsgOriginal=base;
    el.dataset.swirR5MsgColor=out(b);
    el.style.setProperty('color',out(b),'important');
    return true;
  }catch(e){return false}
}

function scan(root=document){
  try{
    if(root.matches?.(MSG_SEL))normalizeMessage(root);
    if(root.matches?.(NICK_SEL))normalizeNick(root);
    root.querySelectorAll?.(MSG_SEL).forEach(normalizeMessage);
    root.querySelectorAll?.(NICK_SEL).forEach(normalizeNick);
  }catch(e){}
}
scan();
let raf=0,pending=new Set();
const mo=new MutationObserver(ms=>{
  for(const m of ms)for(const n of m.addedNodes||[])if(n&&n.nodeType===1)pending.add(n);
  if(raf||!pending.size)return;
  raf=requestAnimationFrame(()=>{raf=0;const a=[...pending];pending.clear();a.forEach(scan)});
});
mo.observe(document.body,{childList:true,subtree:true});

window.SWIR_COLOR_R5={
  version:window.SWIR_COLOR_R5_VERSION,
  refresh:()=>scan(),
  diagnostics(){
    const nicks=[...document.querySelectorAll(NICK_SEL)],msgs=[...document.querySelectorAll(MSG_SEL)];
    const outp={version:window.SWIR_COLOR_R5_VERSION,nicks:nicks.length,messages:msgs.length,badNickClass:nicks.filter(x=>x.className!=='m-msg-item-user-login').length,nicksProcessed:nicks.filter(x=>x.dataset.swirR5NickColor).length,messagesProcessed:msgs.filter(x=>x.dataset.swirR5MsgColor).length};
    console.table(outp);return outp;
  }
};
console.log('✅ SWIR R5: oryginalne kolory + mocniejsza czytelność; granat -> jasny błękit');
}catch(e){console.error('SWIR COLOR R5',e)}})();
