/* SWIR R6 — theme-aware nick/message contrast; native-click safe */
(()=>{try{
if(window.__SWIR_COLOR_R6)return;window.__SWIR_COLOR_R6=1;
window.SWIR_COLOR_R6_VERSION='R6 — THEME AWARE CONTRAST';
const NICK_SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
const MSG_SEL='[id^="m-messages_"] .m-msg-item-user-message';
const clamp=v=>Math.max(0,Math.min(255,Math.round(v)));
const rgb=c=>{const m=String(c||'').match(/rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/i);return m?[+m[1],+m[2],+m[3]]:null};
const out=a=>`rgb(${a[0]}, ${a[1]}, ${a[2]})`;
const lum=a=>.2126*a[0]+.7152*a[1]+.0722*a[2];
const mixWhite=(a,k)=>a.map(v=>clamp(v+(255-v)*k));
const mixBlack=(a,k)=>a.map(v=>clamp(v*(1-k)));
const spread=a=>Math.max(...a)-Math.min(...a);
const nearBlack=a=>Math.max(...a)<=52||(lum(a)<58&&spread(a)<32);
const nearWhite=a=>Math.min(...a)>=218||(lum(a)>225&&spread(a)<38);
const darkNavy=a=>{const[r,g,b]=a,L=lum(a);return b>=72&&b>r*1.28&&b>g*1.13&&(b-r)>=38&&L<150};
const isIce=()=>document.documentElement.dataset.swirTheme99==='ice';
function darkNick(a){
 if(nearBlack(a))return[244,247,250];
 if(darkNavy(a))return[104,204,255];
 const L=lum(a);if(L<85)return mixWhite(a,.48);if(L<125)return mixWhite(a,.34);if(L<165)return mixWhite(a,.20);return mixWhite(a,.08);
}
function darkMsg(a){
 if(nearBlack(a))return[235,241,247];
 if(darkNavy(a))return[110,200,255];
 const L=lum(a);if(L<90)return mixWhite(a,.52);if(L<130)return mixWhite(a,.38);if(L<170)return mixWhite(a,.24);return mixWhite(a,.10);
}
function iceNick(a){
 if(nearWhite(a))return[18,104,138]; // white -> dark cyan
 if(nearBlack(a))return[38,50,66];
 if(darkNavy(a))return[30,92,174];
 const L=lum(a);if(L>220)return mixBlack(a,.58);if(L>190)return mixBlack(a,.46);if(L>160)return mixBlack(a,.30);return a;
}
function iceMsg(a){
 if(nearWhite(a))return[42,72,92];
 if(nearBlack(a))return[35,45,56];
 if(darkNavy(a))return[28,82,160];
 const L=lum(a);if(L>220)return mixBlack(a,.62);if(L>190)return mixBlack(a,.48);if(L>160)return mixBlack(a,.32);return a;
}
function baseColor(el,kind){
 const saved=kind==='nick'?(el.dataset.swirR6NickOriginal||el.dataset.swirR5NickOriginal||el.dataset.swirR4OriginalColor):(el.dataset.swirR6MsgOriginal||el.dataset.swirR5MsgOriginal);
 if(saved){const r=rgb(saved);if(r)return r}
 ['color','text-shadow','font-weight','animation','transition','filter'].forEach(p=>el.style.removeProperty(p));
 return rgb(getComputedStyle(el).color);
}
function normalizeNick(el){try{
 if(!el||!el.matches?.('.m-msg-item-user-login:not(.m-msg-item-image-user-login)'))return false;
 if(el.className!=='m-msg-item-user-login')el.className='m-msg-item-user-login';
 el.querySelectorAll('.swir-mobile-99,.swir-mobile-96,.swir-mobile-r4,.swir-mobile-r5,.swir-mobile-r6').forEach(x=>x.remove());
 el.dataset.swir99nick='1';
 const a=baseColor(el,'nick');if(!a)return false;
 if(!el.dataset.swirR6NickOriginal)el.dataset.swirR6NickOriginal=out(a);
 const b=isIce()?iceNick(a):darkNick(a);
 el.dataset.swirR6NickColor=out(b);el.dataset.swirR6Theme=isIce()?'ice':'dark';
 el.style.setProperty('color',out(b),'important');
 el.style.setProperty('font-weight','750','important');
 el.style.setProperty('text-shadow',isIce()?'none':'0 0 2px rgba(255,255,255,.07)','important');
 return true;
}catch(e){return false}}
function normalizeMsg(el){try{
 if(!el||!el.matches?.('.m-msg-item-user-message'))return false;
 const a=baseColor(el,'msg');if(!a)return false;
 if(!el.dataset.swirR6MsgOriginal)el.dataset.swirR6MsgOriginal=out(a);
 const b=isIce()?iceMsg(a):darkMsg(a);
 el.dataset.swirR6MsgColor=out(b);el.dataset.swirR6Theme=isIce()?'ice':'dark';
 el.style.setProperty('color',out(b),'important');
 el.style.setProperty('text-shadow','none','important');
 return true;
}catch(e){return false}}
function scan(root=document){try{
 if(root.matches?.(NICK_SEL))normalizeNick(root);if(root.matches?.(MSG_SEL))normalizeMsg(root);
 root.querySelectorAll?.(NICK_SEL).forEach(normalizeNick);root.querySelectorAll?.(MSG_SEL).forEach(normalizeMsg);
}catch(e){}}
scan();
let raf=0,pending=new Set();
const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n&&n.nodeType===1)pending.add(n);if(raf||!pending.size)return;raf=requestAnimationFrame(()=>{raf=0;const a=[...pending];pending.clear();a.forEach(scan)})});
mo.observe(document.body,{childList:true,subtree:true});
let themeRaf=0;new MutationObserver(()=>{if(themeRaf)return;themeRaf=requestAnimationFrame(()=>{themeRaf=0;scan()})}).observe(document.documentElement,{attributes:true,attributeFilter:['data-swir-theme99']});
window.SWIR_COLOR_R6={version:window.SWIR_COLOR_R6_VERSION,refresh:()=>scan(),diagnostics(){const n=[...document.querySelectorAll(NICK_SEL)],m=[...document.querySelectorAll(MSG_SEL)],x={version:window.SWIR_COLOR_R6_VERSION,theme:isIce()?'ice':'dark',nicks:n.length,messages:m.length,badNickClass:n.filter(e=>e.className!=='m-msg-item-user-login').length,nicksProcessed:n.filter(e=>e.dataset.swirR6NickColor).length,messagesProcessed:m.filter(e=>e.dataset.swirR6MsgColor).length};console.table(x);return x}};
console.log('✅ SWIR R6: theme-aware contrast aktywny');
}catch(e){console.error('SWIR COLOR R6',e)}})();
