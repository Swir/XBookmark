/* SWIR 10.5 BETA — robust light-theme contrast without touching Friend Radar */
(()=>{try{
if(window.__SWIR_CONTRAST105)return;window.__SWIR_CONTRAST105=1;
const ROOT=document.documentElement;
const SELECTORS=[
 '[id^="m-messages_"] .m-msg-item-user-login',
 '[id^="m-messages_"] .m-msg-item-user-message',
 '[id^="m-messages_"] .m-msg-item-user-message span',
 '[id^="m-messages_"] .m-msg-item-user-message font',
 '[id^="m-messages_"] .m-msg-item-user-message b',
 '[id^="m-messages_"] .m-msg-item-user-message i',
 '[id^="m-users_"] .m-list-user-item',
 '[id^="m-users_"] .m-list-user-item span',
 '.m-usersList .m-list-user-item',
 '.m-usersList .m-list-user-item span'
].join(',');
const clamp=v=>Math.max(0,Math.min(255,Math.round(v)));
function parse(c){const m=String(c||'').match(/rgba?\(\s*([\d.]+)\D+([\d.]+)\D+([\d.]+)(?:\D+([\d.]+))?/i);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null}
function out(a){return `rgb(${clamp(a[0])}, ${clamp(a[1])}, ${clamp(a[2])})`}
function srgb(v){v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)}
function lum(a){return .2126*srgb(a[0])+.7152*srgb(a[1])+.0722*srgb(a[2])}
function ratio(a,b){const A=lum(a),B=lum(b),hi=Math.max(A,B),lo=Math.min(A,B);return(hi+.05)/(lo+.05)}
function theme(){return ROOT.dataset.swirTheme99||ROOT.dataset.swirTheme98||localStorage.getItem('swir_theme_99')||localStorage.getItem('swir_theme_98')||'gaming'}
function isLight(){return theme()==='ice'}
function background(el){let n=el;for(let i=0;n&&i<8;i++,n=n.parentElement){const a=parse(getComputedStyle(n).backgroundColor);if(a&&a[3]>.08)return a}return[255,255,255,1]}
function readable(fg,bg){if(ratio(fg,bg)>=4.6)return fg;for(let k=.08;k<=.78;k+=.04){const c=[fg[0]*(1-k),fg[1]*(1-k),fg[2]*(1-k),1];if(ratio(c,bg)>=4.6)return c}return[28,55,73,1]}
function directText(el){return [...(el?.childNodes||[])].some(n=>n.nodeType===3&&String(n.nodeValue||'').trim())}
function restore(el){if(!el?.dataset?.swir105OriginalColor)return;el.style.setProperty('color',el.dataset.swir105OriginalColor,'important');el.style.setProperty('text-shadow',el.dataset.swir105OriginalShadow||'none','important');delete el.dataset.swir105Contrast}
function fix(el){try{
 if(!el||el.nodeType!==1)return;
 if(!isLight()){restore(el);return}
 if(el.matches('.m-list-user-item span')&&!directText(el))return;
 let original=el.dataset.swir105OriginalColor;
 if(!original){original=getComputedStyle(el).color;el.dataset.swir105OriginalColor=original;el.dataset.swir105OriginalShadow=getComputedStyle(el).textShadow||'none'}
 const fg=parse(original),bg=background(el);if(!fg||!bg)return;
 const c=readable(fg,bg);el.style.setProperty('color',out(c),'important');el.style.setProperty('text-shadow','none','important');el.dataset.swir105Contrast='1';
}catch(e){}}
function scan(root=document){try{
 if(root?.matches?.(SELECTORS))fix(root);
 root?.querySelectorAll?.(SELECTORS).forEach(fix);
}catch(e){}}
function refresh(){scan(document)}
refresh();
let raf=0,pending=new Set();
const mo=new MutationObserver(ms=>{for(const m of ms){for(const n of m.addedNodes||[])if(n?.nodeType===1)pending.add(n)}if(raf||!pending.size)return;raf=requestAnimationFrame(()=>{raf=0;const arr=[...pending];pending.clear();arr.forEach(scan)})});
mo.observe(document.body,{childList:true,subtree:true});
let tr=0;new MutationObserver(()=>{if(tr)return;tr=requestAnimationFrame(()=>{tr=0;refresh()})}).observe(ROOT,{attributes:true,attributeFilter:['data-swir-theme99','data-swir-theme98']});
document.addEventListener('click',e=>{if(e.target?.closest?.('[data-swir-theme99-btn]'))setTimeout(refresh,0)},true);
window.SWIR_CONTRAST105={version:'10.5 BETA — ICE WCAG CONTRAST',refresh,theme,diagnostics(){const a=[...document.querySelectorAll(SELECTORS)],x={theme:theme(),targets:a.length,patched:a.filter(e=>e.dataset.swir105Contrast==='1').length};console.table(x);return x}};
console.log('✅ SWIR 10.5 contrast aktywny');
}catch(e){console.error('SWIR Contrast 10.5',e)}})();
