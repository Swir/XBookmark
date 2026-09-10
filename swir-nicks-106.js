/* SWIR 10.6 BETA — native-ish nick colors, brighter on dark themes, black -> turquoise, no neon */
(()=>{try{
if(window.__SWIR_NICKS106)return;window.__SWIR_NICKS106=1;
const SEL='[id^="m-messages_"] .m-msg-item-user-login:not(.m-msg-item-image-user-login)';
const ROOT=document.documentElement;
const clamp=v=>Math.max(0,Math.min(255,Math.round(v)));
const parse=c=>{const m=String(c||'').match(/rgba?\(\s*([\d.]+)\D+([\d.]+)\D+([\d.]+)/i);return m?[+m[1],+m[2],+m[3]]:null};
const out=a=>`rgb(${clamp(a[0])}, ${clamp(a[1])}, ${clamp(a[2])})`;
const lum=a=>.2126*a[0]+.7152*a[1]+.0722*a[2];
const spread=a=>Math.max(...a)-Math.min(...a);
const mixWhite=(a,k)=>a.map(v=>clamp(v+(255-v)*k));
const mixBlack=(a,k)=>a.map(v=>clamp(v*(1-k)));
const nearBlack=a=>Math.max(...a)<=48||(lum(a)<55&&spread(a)<34);
const theme=()=>ROOT.dataset.swirTheme99||ROOT.dataset.swirTheme98||localStorage.getItem('swir_theme_99')||'gaming';
const lightTheme=()=>theme()==='ice';
function nativeColor(el){let saved=el.dataset.swir106Native;if(saved){const a=parse(saved);if(a)return a}['color','font-weight','text-shadow','animation','transition','filter'].forEach(p=>el.style.removeProperty(p));const a=parse(getComputedStyle(el).color);if(a)el.dataset.swir106Native=out(a);return a}
function mapColor(a){if(nearBlack(a))return lightTheme()?[0,126,136]:[36,207,207];const L=lum(a);if(lightTheme()){if(L>220)return mixBlack(a,.56);if(L>190)return mixBlack(a,.42);if(L>165)return mixBlack(a,.25);return a}if(L<70)return mixWhite(a,.42);if(L<110)return mixWhite(a,.30);if(L<150)return mixWhite(a,.18);if(L<185)return mixWhite(a,.08);return a}
function fix(el){try{if(!el?.matches?.(SEL))return false;const a=nativeColor(el);if(!a)return false;const b=mapColor(a);el.style.setProperty('color',out(b),'important');el.style.setProperty('text-shadow','none','important');el.style.setProperty('animation','none','important');el.style.setProperty('transition','none','important');el.style.setProperty('filter','none','important');el.style.removeProperty('font-weight');el.dataset.swir106Nick='1';el.dataset.swir106Color=out(b);return true}catch(e){return false}}
function scan(root=document){try{if(root?.matches?.(SEL))fix(root);root?.querySelectorAll?.(SEL).forEach(fix)}catch(e){}}
function refresh(){document.querySelectorAll(SEL).forEach(el=>{const a=parse(el.dataset.swir106Native)||nativeColor(el);if(!a)return;const b=mapColor(a);el.style.setProperty('color',out(b),'important');el.style.setProperty('text-shadow','none','important');el.style.setProperty('animation','none','important');el.style.setProperty('filter','none','important');el.dataset.swir106Color=out(b)})}
scan();let raf=0,pending=new Set();new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes||[])if(n?.nodeType===1)pending.add(n);if(raf||!pending.size)return;raf=requestAnimationFrame(()=>{raf=0;const a=[...pending];pending.clear();a.forEach(scan)})}).observe(document.body,{childList:true,subtree:true});let tr=0;new MutationObserver(()=>{if(tr)return;tr=requestAnimationFrame(()=>{tr=0;refresh()})}).observe(ROOT,{attributes:true,attributeFilter:['data-swir-theme99','data-swir-theme98']});document.addEventListener('click',e=>{if(e.target?.closest?.('[data-swir-theme99-btn]'))setTimeout(refresh,0)},true);window.SWIR_NICKS106={version:'10.6 BETA — CLEAN NICKS',refresh,diagnostics(){const n=[...document.querySelectorAll(SEL)],x={theme:theme(),nicks:n.length,processed:n.filter(e=>e.dataset.swir106Nick==='1').length};console.table(x);return x}};console.log('✅ SWIR 10.6 nicki: normalne, jaśniejsze, czarny→turkus, bez neonu');
}catch(e){console.error('SWIR NICKS 10.6',e)}})();
