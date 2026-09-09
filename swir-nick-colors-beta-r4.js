/* SWIR 9.9.1 BETA R4 — original CZATeria nick colors, only brightened; native-click safe */
(()=>{try{
if(window.__SWIR_NICK_R4)return;window.__SWIR_NICK_R4=1;
window.SWIR_NICK_R4_VERSION='9.9.1 BETA R4 — ORIGINAL COLORS';

const SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
function rgb(c){const m=String(c||'').match(/rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);return m?[+m[1],+m[2],+m[3]]:null}
function out(a){return `rgb(${a[0]}, ${a[1]}, ${a[2]})`}
function brighten(a){
  const max=Math.max(...a),min=Math.min(...a),avg=(a[0]+a[1]+a[2])/3;
  if(max<=48 || (avg<58&&max-min<28)) return [244,247,250]; // czarny / prawie czarny -> biało-szary
  let k=max<90?.48:max<145?.32:max<195?.18:.08;
  return a.map(v=>Math.max(0,Math.min(255,Math.round(v+(255-v)*k))));
}
function normalize(el){
  try{
    if(!el||!el.matches?.('.m-msg-item-user-login:not(.m-msg-item-image-user-login)'))return false;
    // Natwyny ContextMenu CZATerii oczekuje dokładnie tej jednej klasy.
    if(el.className!=='m-msg-item-user-login')el.className='m-msg-item-user-login';
    // Badge wewnątrz zmienia innerText nicka i potrafi zepsuć parser loginu.
    el.querySelectorAll('.swir-mobile-99,.swir-mobile-96,.swir-mobile-r4').forEach(x=>x.remove());
    // Zatrzymujemy stary dekorator 9.9, ale cofamy jego inline wygląd.
    el.dataset.swir99nick='1';
    ['color','text-shadow','font-weight','animation','transition','filter'].forEach(p=>el.style.removeProperty(p));
    // Po usunięciu inline stylu przeglądarka znów pokazuje prawdziwy kolor wynikający z data-col/CSS CZATerii.
    const base=getComputedStyle(el).color;
    const r=rgb(base);
    if(!r)return false;
    const b=brighten(r);
    el.dataset.swirR4OriginalColor=base;
    el.dataset.swirR4Color=out(b);
    el.style.setProperty('color',out(b),'important');
    // Delikatna czytelność bez neonowego migania.
    el.style.setProperty('text-shadow','0 0 2px rgba(255,255,255,.08)','important');
    return true;
  }catch(e){return false}
}
function scan(root=document){
  try{
    if(root.matches?.(SEL))normalize(root);
    root.querySelectorAll?.(SEL).forEach(normalize);
  }catch(e){}
}
scan();
let raf=0, pending=new Set();
const mo=new MutationObserver(ms=>{
  for(const m of ms)for(const n of m.addedNodes||[])if(n&&n.nodeType===1)pending.add(n);
  if(raf||!pending.size)return;
  raf=requestAnimationFrame(()=>{raf=0;const a=[...pending];pending.clear();a.forEach(scan)});
});
mo.observe(document.body,{childList:true,subtree:true});

window.SWIR_NICK_R4={
  version:window.SWIR_NICK_R4_VERSION,
  refresh:()=>scan(),
  diagnostics(){
    const all=[...document.querySelectorAll(SEL)];
    const badClass=all.filter(x=>x.className!=='m-msg-item-user-login').length;
    const withBadge=all.filter(x=>x.querySelector('.swir-mobile-99,.swir-mobile-96')).length;
    const out={version:window.SWIR_NICK_R4_VERSION,nicks:all.length,badClass,withBadge,processed:all.filter(x=>x.dataset.swirR4Color).length};
    console.table(out);return out;
  }
};
console.log('✅ SWIR R4: oryginalne kolory nicków + lekkie rozjaśnienie + native-click safe');
}catch(e){console.error('SWIR NICK R4',e)}})();
